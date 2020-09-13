import {getAggregate, streamExists} from "@/store";
import {query} from '@/store/projections';

export const get = async (id: string) => {
  return getAggregate(`users-${id}`);
}

export const exists = async (id: string) => {
  return streamExists(`users-${id}`);
}

export const unique = async (username: string) => {
  const usernames = await query<{[key: string]: number}>('AllUsernames');
  return !usernames[username.trim().toLowerCase()];
}
