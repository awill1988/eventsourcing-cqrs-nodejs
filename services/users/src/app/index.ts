// Register error handling
import errorResponseHandler from '@/app/errors';

import app from './config';

// Attach middleware
import './middleware';

// Attach controllers
import './controllers';

// Queries
import Queue from '@/queue';

import {watchEvents} from '@/store/subscriptions';

Queue.on('ready', async () => {
  app.emit('ready');
  watchEvents();
});

app.use(errorResponseHandler);

export default app;
