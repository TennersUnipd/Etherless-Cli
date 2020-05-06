import { Command, CommandInputs } from './command';
import Logger from '../log';

class RunCommand extends Command {
  COMMAND_NAME = 'run <functionName> <password> [parameters...]';

  COMMAND_ALIAS = 'r';

  COMMAND_DESCRIPTION = 'Request function execution';

  static RESP_AWAIT_TIMEOUT = 30; // seconds

  exec(inputs: RunCommandInputs): Promise<any> {
    return this.network.runFunction(inputs.name, inputs.parameters, inputs.password)
      .then((response) => {
        const resparse = JSON.parse(response);
        if (resparse.elemen.StatusCode !== 200) {
          return 'Something went wrong with the remote function!';
        }
        const logger: Logger = new Logger();
        logger.addLog({
          logName: inputs.name,
          logDate: Date(),
          logCost: resparse.cost,
        });
        logger.save();
        return resparse.elemen.Payload;
      });
  }

  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): CommandInputs {
    const parameters = args.splice(2);
    const serialized = JSON.stringify(parameters[0]);
    return { name: args[0], password: args[1], parameters: serialized };
  }
}

interface RunCommandInputs extends CommandInputs {
  name: string;
  parameters: string;
  password: string;
}

export default RunCommand;
