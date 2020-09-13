import {NextFunction, Request, Response} from 'express';
import net from 'net';

// tslint:disable-next-line
export function wrapAsync(fn: (...args: unknown[]) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    // Promise.resolve(fn(req, res, next)).catch(next);
    return fn(req, res, next).catch(next);
  };
}

export const portInUse = (port: number, hostname = '127.0.0.1'): Promise<boolean> => new Promise((resolve) => {
  const _server = net.createServer((socket) => {
    socket.write('Echo server\r\n');
    socket.pipe(socket);
  });
  _server.listen(port, hostname);
  _server.on('error', () => {
    resolve(true);
  });
  _server.on('listening', () => {
    _server.close();
    resolve(false);
  });
});
