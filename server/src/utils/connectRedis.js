import config from 'config';
import { createClient } from '@vercel/kv';

const kv = createClient({
  url: config.get('kvRestApiUrl'),
  token: config.get('kvRestApiToken')
});

export default kv;