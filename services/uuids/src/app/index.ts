import app from './config';

// Attach middleware
import './middleware';

// Attach controllers
import './controllers';

// Queries

// Register error handling
import './errors';

app.emit('ready');

export default app;
