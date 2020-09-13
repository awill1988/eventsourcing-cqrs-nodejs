import {Request, Response} from 'express';
import {UserCommands} from "@/queue/consumer";
import Queue from "@/queue";
import {exists as userExists} from "@/app/services/users";
import {HttpErrorCode, HttpErrors} from "@/app/errors";

export default async (
  req: Request<{user_id: string}>,
  res: Response,
): Promise<Response> => {
  const {user_id: id} = req.params;

  // TODO Check if user exists
  const exists = await userExists(id);

  if (!exists) {
    throw HttpErrors.withCode(HttpErrorCode.NOT_FOUND, 'User does not exist');
  }

  const producer = Queue.producer();

  producer.send(JSON.stringify({
    command: UserCommands.Delete,
    data: {id},
  }));

  return res.status(204).send(null);
}
