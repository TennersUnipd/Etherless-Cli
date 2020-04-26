import axios from 'axios';
/**
 * @abstract NetworkInterface defines the method that all NetworkInterface classes should implements
 */
export default abstract class NetworkInterface {
  protected provider:string;

  /**
   * @method constructor
   * @param provider the provider for the network connection
   */
  public constructor(provider:string) {
    this.provider = provider;
  }

  /**
   * @method disconnect
   * @brief terminate the connection to the provider
   */
  public abstract disconnect():void;

  /**
   * @method sendTransaction
   * @brief this method sends an signed transaction
   * @param transaction required transaction object
   */
  public abstract sendTransaction(transaction:any):Promise<any>

  /**
   * @abstract
   * @method callMethod
   * @param callable
   * @param address
   * @returns a Promise that contain the result of the request
   * @brief this method is used to ask at the contract the execution of non payable methods
   */
  public abstract callMethod(callable:any, address:string):Promise<any>
  /**
   * @static
   * @method uploadFunction
   * @param fileBuffer 
   * @param ename 
   * @param endpoint 
   * @brief this method is used for the upload of a function to the AWS service.
   */
  static uploadFunction(fileBuffer: string, ename:string, endpoint:string): Promise<any> {
    return axios.post(endpoint,
      {
        zip: fileBuffer,
        name: ename,
      });
  }
  /**
   * @static
   * @method deleteFunction
   * @param functionARN
   * @brief this method is used to delete a remote function
   */
  static deleteFunction(arn:string, endpoint:string): Promise<any> {
    return axios.post(endpoint,
      {
        resource: arn,
      });
  }
}
