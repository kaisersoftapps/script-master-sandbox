import { storage } from '@forge/api';
import { CONFIG_ENTITY_PROPERTY_NAME } from '../model/const';
import type { Config } from '../model/types';

export const getConfig = async () => {
  return await storage.getSecret(CONFIG_ENTITY_PROPERTY_NAME) as Config | undefined;
};

export const saveConfig = async (config: Config) => {
  await storage.setSecret(CONFIG_ENTITY_PROPERTY_NAME, config);
};

export const deleteConfig = async () => {
  await storage.deleteSecret(CONFIG_ENTITY_PROPERTY_NAME);
};
