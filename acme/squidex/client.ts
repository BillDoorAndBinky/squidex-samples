import { SquidexClient } from '@squidex/squidex';

const client = new SquidexClient({
  clientId: 'acme-sample:default',
  clientSecret: 'upuxhqgubhnhxlu77voejbbxxcueakxokzmjf9xax94x',
  appName: 'acme-sample'
});

export const getSquidexClient = () => {
  return client;
};