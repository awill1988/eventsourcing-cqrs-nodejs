import {Request, Response} from 'express';
import getUUIDs from '@/app/services/uuid';
import Queue from '@/queue';
import {UserCommands} from "@/queue/consumer";
import {unique} from "@/app/services/users";
import {HttpErrorCode, HttpErrors} from "@/app/errors";

export default async (
  req: Request<unknown>,
  res: Response,
): Promise<Response> => {
  const {body: {username, given_name, family_name}} = req;
  const producer = Queue.producer();

  const isUniqueUsername = await unique(username);

  if (!isUniqueUsername) {
    throw HttpErrors.withCode(HttpErrorCode.CONFLICT, 'User with provided username already exists');
  }

  const [id] = await getUUIDs(1);

  const newUser = {
    id,
    username,
    given_name,
    family_name,
  };

  producer.send(JSON.stringify({
    command: UserCommands.Create,
    data: newUser,
  }));

  // Go for eventual consistency, if there is no error here, then reflect the resource here
  return res.status(201).send(newUser);
}
