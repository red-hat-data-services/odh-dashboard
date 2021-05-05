import * as path from 'path';
import * as dotenv from 'dotenv';

const setupDotenvFile = (path: string) => dotenv.config({ path });

export const setupDotenvFilesForEnv = (env: string): void => {
  const RELATIVE_DIRNAME = path.resolve(__dirname, '..', '..', '..');

  if (env) {
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, `.env.${env}.local`));
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, `.env.${env}`));
  }

  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env.local'));
  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env'));
};
