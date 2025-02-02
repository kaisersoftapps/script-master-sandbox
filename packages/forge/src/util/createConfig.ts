import { v4 as uuidv4 } from 'uuid';
import type { Config } from '../model/types';

export const createConfig = () => {
  const config: Config = {
    token: uuidv4(),
  };

  return config;
};
