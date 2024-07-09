import type { DaoTemplate } from '@mijoco/stx_helpers/dist/dao';
import { getConfig } from '$stores/store_helpers';

export async function launchDao(template:DaoTemplate) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/launch`;
  const response = await fetch(path, {
    method: 'POST',
    headers:  { 'Content-Type': 'application/json', 'Authorization': '' },
    body: JSON.stringify(template)
  });

  if (response.status !== 200) {
    return {
      error: 'Error broadcasting',
      status: response.status
    }
  }
  return await response.json();
}

export const deployer_roles = [
	{
		secret_key: '753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601',
		stx_address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
		deployed: false,
		constructed: false
	},
	{
		secret_key: '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801',
		stx_address: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
		deployed: false,
		constructed: false
	},
	{
		secret_key: '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101',
		stx_address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
		deployed: false,
		constructed: false
	},
	{
		secret_key: 'd655b2523bcd65e34889725c73064feb17ceb796831c0e111ba1a552b0f31b3901',
		stx_address: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
		deployed: false,
		constructed: false
	},
	{
		secret_key: 'f9d7206a47f14d2870c163ebab4bf3e70d18f5d14ce1031f3902fbbc894fe4c701',
		stx_address: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
		deployed: false,
		constructed: false
	},
	{
		secret_key: '3eccc5dac8056590432db6a35d52b9896876a3d5cbdea53b72400bc9c2099fe801',
		stx_address: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
		deployed: false,
		constructed: false
	},
	{
		secret_key: '7036b29cb5e235e5fd9b09ae3e8eec4404e44906814d5d01cbca968a60ed4bfb01',
		stx_address: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
		deployed: false,
		constructed: false
	},
	{
		secret_key: 'b463f0df6c05d2f156393eee73f8016c5372caa0e9e29a901bb7171d90dc4f1401',
		stx_address: 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ',
		deployed: false,
		constructed: false
	},
	{
		secret_key: '6a1a754ba863d7bab14adbbc3f8ebb090af9e871ace621d3e5ab634e1422885e01',
		stx_address: 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP',
		deployed: false,
		constructed: false
	},
	{
		secret_key: 'de433bdfa14ec43aa1098d5be594c8ffb20a31485ff9de2923b2689471c401b801',
		stx_address: 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6',
		deployed: false,
		constructed: false
	},
]
