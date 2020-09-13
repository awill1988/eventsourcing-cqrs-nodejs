import path from 'path';
import app from '@/app/config';
import createUser from './create';
import patchUser from './patch';
import deleteUser from './delete';
import getUser from './get';
import {wrapAsync} from '@/helpers';

const SERVICE_PATH = '/';
const RESOURCE_IDENTIFIER = ':user_id';

// Enroll new user
app.post(path.join(SERVICE_PATH), wrapAsync(createUser));

// Patch User
app.patch(path.join(SERVICE_PATH, RESOURCE_IDENTIFIER), wrapAsync(patchUser));

// Get single user
app.get(path.join(SERVICE_PATH, RESOURCE_IDENTIFIER), wrapAsync(getUser));

// Delete user
app.delete(path.join(SERVICE_PATH, RESOURCE_IDENTIFIER), wrapAsync(deleteUser));
