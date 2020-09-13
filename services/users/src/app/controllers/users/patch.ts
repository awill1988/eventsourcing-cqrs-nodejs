import {Request, Response} from 'express';
import {exists as userExists, unique} from "@/app/services/users";
import Queue from '@/queue';
import {UserCommands} from "@/queue/consumer";
import {HttpErrorCode, HttpErrors} from "@/app/errors";

export default async (
  req: Request<{user_id: string}>,
  res: Response,
): Promise<Response> => {
  const {user_id: id} = req.params;
  const {body: {username, given_name, family_name}} = req;

  const exists = await userExists(id);

  if (!exists) {
    throw HttpErrors.withCode(HttpErrorCode.NOT_FOUND, 'User does not exist');
  }

  const isUniqueUsername = await unique(username);

  if (!isUniqueUsername) {
    throw HttpErrors.withCode(HttpErrorCode.CONFLICT, 'User with provided username already exists');
  }
  const updatedUser = {
    id,
    username,
    given_name,
    family_name,
  };

  const producer = Queue.producer();

  producer.send(JSON.stringify({
    command: UserCommands.Patch,
    data: updatedUser,
  }));

  // Go for eventual consistency, if there is no error here, then reflect the resource here
  return res.status(204).send(null);
}
