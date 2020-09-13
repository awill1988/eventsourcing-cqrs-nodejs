import {Request, Response} from 'express';
import {get as getUser} from "@/app/services/users";

export default async (
  req: Request<{user_id: string}>,
  res: Response,
): Promise<Response> => {
  const {user_id: id} = req.params;
  const user = await getUser(id);
  return res.status(200).send(user);
}
