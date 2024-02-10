import config from 'config';
import { createClient } from '@vercel/kv';

const kv = createClient({
  url: config.util.getEnv('kvRestApiUrl'),
  token: config.util.getEnv('kvRestApiToken')
});

export default kv;