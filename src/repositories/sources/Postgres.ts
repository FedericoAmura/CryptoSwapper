import { Pool } from 'pg';

import config from '../../config';
const postgresConfig = config.get('postgres');

const swapper = new Pool({
  user: postgresConfig.user,
  password: postgresConfig.password,
  port: postgresConfig.port,
  host: postgresConfig.host,
});

export default swapper;
