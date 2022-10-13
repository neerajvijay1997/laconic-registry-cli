import { Arguments } from 'yargs';
import assert from 'assert';
import { Registry } from 'laconic-sdk';

import { getConfig, getConnectionInfo, getGasAndFees } from '../../../util';

export const command = 'associate';

export const desc = 'Associate record with bond.';

export const builder = {
  'bond-id': {
    type: 'string'
  }
}

export const handler = async (argv: Arguments) => {
  const id = argv.id as string;
  const bondId = argv.bondId as string;
  assert(id, 'Invalid Record ID.');
  assert(bondId, 'Invalid Bond ID.');

  const { services: { cns: cnsConfig } } = getConfig(argv.config as string)
  const { restEndpoint, gqlEndpoint, privateKey, chainId } = getConnectionInfo(argv, cnsConfig);
  assert(restEndpoint, 'Invalid CNS REST endpoint.');
  assert(gqlEndpoint, 'Invalid CNS GQL endpoint.');
  assert(privateKey, 'Invalid Transaction Key.');
  assert(chainId, 'Invalid CNS Chain ID.');

  const registry = new Registry(restEndpoint, gqlEndpoint, chainId);
  const fee = getGasAndFees(argv, cnsConfig);
  const result = await registry.associateBond({ recordId: id, bondId }, privateKey, fee);
  console.log(JSON.stringify(result, undefined, 2));
}
