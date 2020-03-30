
import { Command, CommandInputs } from './command';
import Utils from '../utils';
import { functionDefinition } from '../NetworkEntities/NetworkFacade';

export class CreateCommand extends Command {
    COMMAND_NAME = 'create <name> <description> <prototype> <cost> <file>';

    COMMAND_ALIAS = 'c';

    COMMAND_DESCRIPTION = 'Create a new function on Etherless';

    exec(inputs: CreateCommandInputs): Promise<any> {
      const compressedFile = Utils.compressFile(inputs.filePath);
      let functionToUpload:functionDefinition;
      functionToUpload.name = inputs.name;
      functionToUpload.description = inputs.description;
      functionToUpload.bufferFile = compressedFile;
      return this.network.uploadFunction(functionToUpload);
    }

    // eslint-disable-next-line class-methods-use-this
    parseArgs(args: string[]): CommandInputs {
      return {
        name: args[0], description: args[1], prototype: args[2], cost: args[3], filePath: args[4],
      };
    }
}

export interface CreateCommandInputs extends CommandInputs {
    name: string;
    description: string;
    prototype: string;
    cost: number;
    filePath: string;
}
