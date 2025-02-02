import Resolver from '@forge/resolver';
import { getWebTriggerUrl, recreateWebTriggerUrl } from './api/webTriggerUrlApi';

export const resolver = new Resolver()
  .define('GetWebTriggerUrl', getWebTriggerUrl)
  .define('RecreateWebTriggerUrl', recreateWebTriggerUrl)
  .getDefinitions();

export { webtrigger } from './api/invokeWebTrigger';
