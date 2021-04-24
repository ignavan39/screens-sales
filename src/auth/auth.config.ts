import { registerAs } from '@nestjs/config';
import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  DOMAIN,
} from 'src/constants';

export default registerAs('auth', () => ({
  domain: DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  audience: AUTH0_AUDIENCE,
}));
