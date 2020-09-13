import {ProjectionsManager, UserCredentials} from "node-eventstore-client";
import {EVENTSTORE_HTTP_ENDPOINT} from "@/env";

const manager = new ProjectionsManager(console, `http://${EVENTSTORE_HTTP_ENDPOINT}`, 1000);
const credentials = new UserCredentials('admin', 'changeit');

export const query = async <T= unknown> (name: string): Promise<T> => {
  try {
    const result = await manager.getResult(
      name,
      credentials,
    );
    return JSON.parse(result || '{}') as T;
  } catch (e) {
    throw e;
  }
}

export const createContinuous = async (name: string, query: string): Promise<boolean> => {
  try {
    const result = await manager.createContinuous(
      name,
      query,
      true,
      credentials,
    );
    console.log(result);
    return true;
  } catch (e) {
    if (e.httpStatusCode === 409) {
      return true;
    }
    throw e;
  }
}

(global as any).Projections = {
  createContinuous,
  query,
};

createContinuous('AllUsernames', "fromAll().when({$init: function(){return {};},UserCreated: function(s, e) {if (e.data && e.data.username) {s[`${e.data.username.toLowerCase()}`] = 1;}}}).outputState();");
