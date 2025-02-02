import { API_VERSION } from '../model/const';
import type { Config } from '../model/types';

export const createFullUrl = (webTriggerUrl: string, config: Config) => {
  return `${webTriggerUrl}?version=${API_VERSION}&token=${config.token}`;
};
