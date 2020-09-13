import express from 'express';

// Create Express server
const app = express();

// Configure Express port
if (!/\d{4,}/.test(process.env.APP_PORT || '')) {
  throw new Error('APP_PORT env variable is not set!');
}

// Express configuration
app.set('port', process.env.APP_PORT);

export default app;
