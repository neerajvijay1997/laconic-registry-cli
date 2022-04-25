import { Arguments } from 'yargs';
import assert from 'assert';
import { Registry } from 'chiba-clonk-client';

import { getConfig, getConnectionInfo } from '../../../util';

export const command = 'list';

export const desc = 'List records.';

export const builder = {
  'bond-id': {
    type: 'string'
  },
  type: {
    type: 'string'
  },
  name: {
    type: 'string'
  },
  all: {
    type: 'boolean',
    default: false
  }
}

export const handler = async (argv: Arguments) => {
  const { services: { cns: cnsConfig } } = getConfig(argv.config as string)
  const { restEndpoint, gqlEndpoint, chainId } = getConnectionInfo(argv, cnsConfig);
  const { type, name, bondId, all } = argv;

  assert(restEndpoint, 'Invalid CNS REST endpoint.');
  assert(gqlEndpoint, 'Invalid CNS GQL endpoint.');
  assert(chainId, 'Invalid CNS Chain ID.');

  const registry = new Registry(restEndpoint, gqlEndpoint, chainId);

  const result = await registry.queryRecords({ bondId, type, name }, all as boolean);
  console.log(JSON.stringify(result, undefined, 2));
}
