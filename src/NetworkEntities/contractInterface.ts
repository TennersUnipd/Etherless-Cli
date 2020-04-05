import { Contract } from 'web3-eth-contract';

/**
 * ContractInterface
 * @brief This Interface defines all the method that a ContractInterface should implements
 * @class ContractInterface
 * @memberof Network
 */
export abstract class ContractInterface {
  public contract: Contract;

  /**
   * getListOfFunctions
   * @brief this method returns all the available methods of the contract
   * @returns string[]
   */
  public abstract getListOfFunctions(): string[];

  /**
   * @method getParametersOfFunction
   * @brief this method returns all the parameter required to run the requested function
   * @param requested the string that identify the function required
   * @returns Inputs[]
   */
  public abstract getArgumentsOfFunction(requested:string):Inputs[];

  /**
   * @method isTheFunctionPayable
   * @brief returns if the requested function is payable
   * @param requested the name of the function requested
   * @returns boolean true if the function is payable
   */
  public abstract isTheFunctionPayable(requested:string):boolean;

  /**
   * @method estimateGasCost
   * @brief return the estimated gas cost of running a function
   * @param userAddress
   * @param requested the name of the function requested
   */
  public abstract estimateGasCost(userAddress:string, requested:string, args:any[], value: number):Promise<number>;

  /**
   * callFunction
   * @brief This method returns the transaction about the requested object
   * @param requested the string that identify the function required
   * @param arg an array of required parameters for the execution of the requested function
   * @returns Promise<object> that is a transaction for the requested function.
   */
  public abstract getFunctionTransaction(userAddress:string, requested: string, arg: any[], gasEstimate: number, value: number)
    :Promise<object>;


  /**
   *
   * @param requested
   * @param any
   */
  public abstract getCallable(requested:string, arg:any[]):any

  /**
   * getLog
   * @brief this method retrieve from the network all the history of a specific address
   * @param address address to use as filter for research of past transaction
   */
  public abstract getLog(address:string):Promise<string[]>;

  /**
   * @param signal the name of the signal thats needs to be captured
   * @param id the identifier of the signal to avoid collision with another request
   */
  public abstract getSignal(signalName:string, id:string):Promise<any>;
}

/**
 * @interface Inputs
 * @brief this Interface defines the structure the arguments request for execution
 */
export interface Inputs {
  internalType: string,
  name: string,
  type: string
}
