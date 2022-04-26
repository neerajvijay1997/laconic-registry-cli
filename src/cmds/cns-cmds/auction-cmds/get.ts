import { Arguments } from 'yargs';
import assert from 'assert';
import { Registry } from 'chiba-clonk-client';

import { getConfig, getConnectionInfo } from '../../../util';

export const command = 'get [id]';

export const desc = 'Get auction information.';

export const handler = async (argv: Arguments) => {
  const { id, config } = argv;
  assert(id, 'Invalid auction ID.');

  const { services: { cns: cnsConfig } } = getConfig(config as string)
  const { restEndpoint, gqlEndpoint, chainId } = getConnectionInfo(argv, cnsConfig);
  assert(restEndpoint, 'Invalid CNS REST endpoint.');
  assert(gqlEndpoint, 'Invalid CNS GQL endpoint.');
  assert(chainId, 'Invalid CNS Chain ID.');

  const registry = new Registry(restEndpoint, gqlEndpoint, chainId);
  const result = await registry.getAuctionsByIds([id as string]);

  console.log(JSON.stringify(result, undefined, 2));
}