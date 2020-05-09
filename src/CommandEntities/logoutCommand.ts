import { Command } from './command';

export default class AccountLogoutCommand extends Command {
  COMMAND_NAME = 'logout';

  COMMAND_ALIAS = 'lo';

  COMMAND_DESCRIPTION = 'Logout from your account';

  // eslint-disable-next-line class-methods-use-this
  exec(): Promise<string> {
    this.network.logout();
    return new Promise((resolve) => {
      resolve('Logged out');
    });
  }
}
