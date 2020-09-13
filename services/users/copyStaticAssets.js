const {cp} = require('shelljs');

cp('-R', 'src/.env*', `${__dirname}/build/`);
