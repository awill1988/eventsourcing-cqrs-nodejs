import {resolve} from 'path';
import {config} from 'dotenv';

const ENV_FILE_PATH = resolve(__dirname, './.env');

// Set environment variables from .env file, if present
config({path: ENV_FILE_PATH});

console.log(process.env);

export const EVENTSTORE_HTTP_ENDPOINT = process.env.EVENTSTORE_HTTP_ENDPOINT || 'localhost:2113'
export const EVENTSTORE_TCP_ENDPOINT = process.env.EVENTSTORE_TCP_ENDPOINT || 'localhost:1113'
