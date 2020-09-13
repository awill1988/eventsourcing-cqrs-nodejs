import app from '@/app/config';

import bodyParser from 'body-parser';

// First assume json with application/json header type
app.use(bodyParser.json({limit: '1kb'}));
