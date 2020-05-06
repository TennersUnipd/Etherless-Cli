import { Command, CommandInputs } from './command';

export class UpdateCommand extends Command {
  COMMAND_NAME = 'update <function> <file>';

  COMMAND_ALIAS = 'u';

  COMMAND_DESCRIPTION = 'Update function';

  exec(inputs: UpdateInputs): Promise<string> {
    return new Promise((resolve, reject) => {
      this.network.updateFunction(inputs.functionName, inputs.filePath)
        .then(() => { resolve('Done'); })
        .catch((err) => { reject(err); });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): UpdateInputs {
    return { functionName: args[0], filePath: args[1] };
  }
}

interface UpdateInputs extends CommandInputs {
  functionName: string;
  filePath: string;
}

export default UpdateCommand;
