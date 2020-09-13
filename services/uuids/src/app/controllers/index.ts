import app from '@/app/config';
import getID from './get';

// Health check TODO Maybe only allow internal ip addresses
app.get('_healthz', (req, res) => res.sendStatus(200));

// Get collection of users
app.get('/', getID);
