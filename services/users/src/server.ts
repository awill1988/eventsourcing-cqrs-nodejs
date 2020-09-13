import app from '@/app';
import {portInUse} from '@/helpers';
import * as http from 'http';

let server: http.Server|{close: () => void} = {close: () => null};

app.on('ready', async () => {
  // eslint-disable-next-line no-console
  console.info('services ready...');
  const listenAddress = '0.0.0.0';
  const alreadyListening = await portInUse(app.get('port'), listenAddress);
  if (alreadyListening) {
    console.warn('Port already taken... no idea why...');
  } else {
    server = app.listen(app.get('port'), listenAddress, () => {
      console.warn(`App is running at http://${listenAddress}:${app.get('port')} in ${app.get('env')} mode`);
    });
  }
});

export default server;
