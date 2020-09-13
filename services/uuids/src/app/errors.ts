import {Request, Response} from 'express';
import app from '@/app/config';

// Add catching for errors
function errorResponseHandler(err: Error & {code: number}, req: Request, res: Response) {
  if (err.code) {
    return res.status(err.code).send({message: err.message});
  }
  // Unexpected error, log it and respond with 500 status code without a body
  console.error(err);
  return res.status(500).send(null);
}

app.use(errorResponseHandler);
