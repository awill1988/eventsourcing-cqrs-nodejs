import 'bluebird-global';
import './env';

import server from './server';

async function exitHandler(options: {exit: boolean}) {
  console.warn('Exiting... disconnecting clients...');
  server.close(() => {
    if (options.exit) {
      process.exit(0);
    }
  });
  // Force close server after 5 secs
  setTimeout((e) => {
    console.warn('Forcing server close !!!', e);
    process.kill(process.pid, 'SIGUSR2');
  }, 1000);
}

// Handle all exit codes imaginable
process.once('SIGINT', exitHandler.bind(null, {exit: true}));
process.once('SIGUSR1', exitHandler.bind(null, {exit: true}));
process.once('SIGUSR2', exitHandler.bind(null, {exit: true}));
process.once('SIGTERM', exitHandler.bind(null, {exit: true}));
process.once('SIGHUP', exitHandler.bind(null, {exit: true}));
