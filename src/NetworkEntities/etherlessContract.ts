import { Contract } from 'web3-eth-contract';

import { AbiItem, AbiInput } from 'web3-utils';
import { Log } from 'web3-core';


import Web3 from 'web3';
import { ContractInterface, Transaction, FunctionRequest } from './contractInterface';

class EtherlessContract extends ContractInterface {
  private readonly GASBASE = 1000000;

  private contract: Contract;

  private web3: Web3;

  private address: string;

  private commandList: AbiItem[];

  /**
   *
   * @param ABI
   * @param contractAddress
   * @param provider
   */
  constructor(ABI: AbiItem[], contractAddress: string, provider: any) {
    super();
    this.web3 = provider;
    this.commandList = ABI;
    this.contract = new this.web3.eth.Contract(ABI, contractAddress);
    this.address = contractAddress;
  }

  /**
   * @param userAddress
   * @param requested
   * @param request
   * @param args
   */
  public async estimateGasCost(request: FunctionRequest): Promise<number> {
    return new Promise((resolve, reject) => {
      this.web3.eth.estimateGas({
        from: request.userAddress,
        to: this.contract.options.address,
        gas: this.GASBASE,
        data: this.getAbiEncode(request.functionName, request.args),
        value: request.value,
      })
        .then((cost: number) => {
          resolve(cost);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public decodeResponse(requested: string, encodedResult: any): any {
    const out = this.commandList.filter((ele) => ele.name === requested)[0].outputs;
    return this.web3.eth.abi.decodeParameters(out, encodedResult)[0];
  }

  private getAbiEncode(requested: string, args: string[]): string {
    const functionAbi = this.contract
      .options.jsonInterface.filter((element) => element.name === requested)[0];
    return this.web3.eth.abi.encodeFunctionCall(functionAbi, args);
  }

  /**
   *
   * @param signal
   * @param id
   */
  public getSignal(signal: string, id: string): Promise<any> {
    return new Promise<string>((resolve, reject) => {
      this.contract.once(signal, { filter: { _identifier: id } }, (err: any, event: any) => {
        if (err !== null) {
          reject(new Error(`Could not get the signal requested error: ${err}`));
        }
        // eslint-disable-next-line no-underscore-dangle
        resolve(JSON.parse(event.returnValues._response));
      });
    });
  }

  /**
   *
   */
  public getListOfFunctions(): string[] {
    const toReturn: string[] = [];
    this.commandList.filter((elem) => {
      if (elem.name !== undefined && !elem.name.includes('(')) {
        toReturn.push(elem.name);
        return true;
      }
      return false;
    });
    return toReturn;
  }

  /**
   *
   * @param requested
   */
  public isTheFunctionPayable(requested: string): boolean {
    const item: AbiItem[] = this.commandList.filter((ele) => ele.name === requested);
    if (item[0] === undefined) throw new Error('the called function is missing');
    return item[0].stateMutability !== 'view';
  }

  /**
   * @param userAddress
   */
  public async getLog(userAddress: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransactionCount(userAddress)
        .then((value) => {
          resolve([value.toString()]);
        })
        .catch((err) => { reject(err); });
    });
  }

  /**
   * @param userAddress
   * @param requested
   * @param request
   * @param args
   */
  public async getFunctionTransaction(request: FunctionRequest): Promise<Transaction> {
    if (this.commandList.find((fn) => fn.name === request.functionName) === undefined) {
      throw new Error('Function not found');
    }
    return this.prepareTransaction(request);
  }

  /**
   * @param request
   */
  private async prepareTransaction(request: FunctionRequest): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      this.estimateGasCost(request).then((gasEstimate: number) => {
        resolve({
          from: request.userAddress,
          to: this.contract.options.address,
          gas: gasEstimate,
          data: this.getAbiEncode(request.functionName, request.args),
          value: request.value,
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public getTopic(signature: string): string {
    const element = JSON.parse(JSON.stringify(this.contract.options.jsonInterface))
      .filter((AbiElement) => AbiElement.signature === signature)[0];
    return element;
  }
}

export default EtherlessContract;
