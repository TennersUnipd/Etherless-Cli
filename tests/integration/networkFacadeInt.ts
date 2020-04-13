/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'mocha';

import { assert } from 'chai';

import Ganache from 'ganache-core';

import Web3 from 'web3';
import NetworkUtils from '../../src/NetworkEntities/networkUtils';
import SessionInterface from '../../src/NetworkEntities/sessionInterface';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import EtherlessContract from '../../src/NetworkEntities/etherlessContract';
import EtherlessNetwork from '../../src/NetworkEntities/etherlessNetwork';
import EtherlessSession from '../../src/NetworkEntities/etherlessSession';
import NetworkInterface from '../../src/NetworkEntities/networkInterface';
import { NetworkFacade } from '../../src/NetworkEntities/networkFacade';
import * as variables from '../unit/NetworkTest/SharedVariables';


const FakeProvider = require('web3-fake-provider');

const provider = new FakeProvider();

const web3:Web3 = new Web3(provider);

const network: NetworkInterface = new EtherlessNetwork(web3);
const session: SessionInterface = new EtherlessSession(web3);
const contract: ContractInterface = new EtherlessContract(variables.dummyAbi,
  variables.contractAddress, web3);

describe('NetworkFacade integration test', () => {
  const networkF: NetworkFacade = new NetworkFacade(network, session, contract);
  it('testing signup', () => {
    const result = networkF.signup('test1');
    assert.isTrue(result, 'signup does not working');
  });
  it('testing login', async () => {
    const result = networkF.logon('0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f', 'password');
    assert.isTrue(result, 'login is not working');
  });
  it('testing getListOfFunctions', () => {
    const result = networkF.getListOfFunctions();
    assert.isArray(result, 'getListOfFunctions is not working');
    assert.include(result, 'listFunctions', 'the test doesn\'t work');
  });
});
