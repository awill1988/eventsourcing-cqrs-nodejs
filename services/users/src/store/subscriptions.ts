import {client} from './';
import {
  EventAppearedCallback,
  EventStoreSubscription, ResolvedEvent,
  SubscriptionDroppedCallback,
  UserCredentials
} from "node-eventstore-client";

const resolveLinkTos = false

const belongsToAUserAggregate = (event: ResolvedEvent) => event.originalEvent?.eventStreamId.startsWith('users-')

const eventAppeared: EventAppearedCallback<EventStoreSubscription> = (subscription, event) => {
  if (belongsToAUserAggregate(event)) {
    const aggregateId = event.originalEvent?.eventStreamId
    const eventId = event.originalEvent?.eventId
    const eventType = event.originalEvent?.eventType
    console.log(aggregateId, eventType, eventId)
    console.log(event.originalEvent?.data?.toString())
  }
}

const subscriptionDropped: SubscriptionDroppedCallback<unknown> = (subscription: unknown, reason: string, error?: Error) =>
  console.log(error ? error : "Subscription dropped.")

export const watchEvents = async () => {
  const store = await client();
  const credentials = new UserCredentials("admin", "changeit");
  const subscription = await store.subscribeToAll(
    resolveLinkTos,
    eventAppeared,
    subscriptionDropped,
    credentials,
  );
  console.log(`subscription.isSubscribedToAll: ${subscription.isSubscribedToAll}`);
  return true;
}
