import kvs from '@forge/kvs';
import { CONFIG_ENTITY_PROPERTY_NAME } from '../model/const';
import type { Config } from '../model/types';

export const getConfig = async () => {
  return await kvs.getSecret<Config>(CONFIG_ENTITY_PROPERTY_NAME);
};

export const saveConfig = async (config: Config) => {
  await kvs.setSecret(CONFIG_ENTITY_PROPERTY_NAME, config);
};

export const deleteConfig = async () => {
  await kvs.deleteSecret(CONFIG_ENTITY_PROPERTY_NAME);
};
