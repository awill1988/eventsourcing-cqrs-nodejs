import esClient, {EventStoreNodeConnection, ResolvedEvent, StreamEventsSlice} from 'node-eventstore-client';
import getUUIDs from "@/app/services/uuid";
import {v4 as uuid} from 'uuid';
import {HttpErrors} from "@/app/errors";
import {EVENTSTORE_TCP_ENDPOINT} from "@/env";

import './projections';

let _client: EventStoreNodeConnection|null = null;

const connSettings = {};  // Use defaults

export const client = async (): Promise<EventStoreNodeConnection> => new Promise((resolve) => {
  if (!_client) {
    const esConnection = esClient.createConnection(connSettings, `tcp://${EVENTSTORE_TCP_ENDPOINT}`);
    esConnection.connect();
    esConnection.once('connected', function (tcpEndPoint) {
      console.log('Connected to eventstore at ' + tcpEndPoint.host + ":" + tcpEndPoint.port);
      _client = esConnection;
      return resolve(_client);
    });
  } else {
    resolve(_client);
  }
});

export const appendTo = async (streamName: string, eventType: string, body: any, id?: string) => {
  const store = await client();
  const [generatedId] = await getUUIDs(typeof id !== 'string' ? 1 : 0);
  const eventId = uuid();
  const event = esClient.createJsonEventData(
    eventId, {
      ...body,
      id: id ?? generatedId,
    },
    null,
    eventType,
  );
  try {
    await store.appendToStream(streamName, esClient.expectedVersion.any, event);
    console.log("Stored event:", eventId);
    console.log(`Look for it at: http://localhost:2113/web/index.html#/streams/${streamName}`);
  } catch (e) {
    console.log(e);
  }
}

const readStreamEventForwardIndefinitely = async (stream: string, maxCount = 1, lastEvent?: StreamEventsSlice): Promise<ResolvedEvent[]> => {
  const store = await client();
  if (!lastEvent) {
    lastEvent = await store.readStreamEventsForward(stream, 0, maxCount);
    if (lastEvent.lastEventNumber.equals(-1) || lastEvent.status === 'streamDeleted') {
      throw HttpErrors.withCode(404);
    }
  } else {
    lastEvent = await store.readStreamEventsForward(stream, lastEvent.nextEventNumber, maxCount);
    if (lastEvent?.isEndOfStream) {
      return lastEvent.events;
    }
  }
  return lastEvent
    .events
    .concat(
      await readStreamEventForwardIndefinitely(stream, maxCount, lastEvent)
    );
}

export const getAggregate = async <T = unknown> (stream: string): Promise<T> => {
  try {
    const events = await readStreamEventForwardIndefinitely(stream, 1000);
    return events.reduce<T>(
      (previousValue, currentValue) => ({
        ...previousValue,
        ...JSON.parse((currentValue.event?.data ?? Buffer.from('{}')).toString()),
      }), {} as T) as unknown as T;
  } catch (e) {
    throw e;
  }
}

export const streamExists = async (stream: string): Promise<boolean> => {
  const store = await client();
  const lastEvent = await store.readStreamEventsForward(stream, 0, 1);
  return lastEvent.lastEventNumber.greaterThan(-1) && lastEvent.status !== 'streamDeleted';
}

export const deleteStream = async (stream: string): Promise<boolean> => {
  const store = await client();
  const result = await store.deleteStream(stream, esClient.expectedVersion.any, true);
  console.log(result);
  return true;
}
