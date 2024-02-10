import config from 'config';
import { createClient } from '@vercel/kv';

const kv = createClient({
  url: app.get('kvRestApiUrl'),
  token: app.get('kvRestApiToken')
});

export default kv;