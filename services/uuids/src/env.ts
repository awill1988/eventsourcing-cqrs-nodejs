import {resolve} from 'path';
import {config} from 'dotenv';

const ENV_FILE_PATH = resolve(__dirname, './.env');

// Set environment variables from .env file, if present
config({path: ENV_FILE_PATH});
