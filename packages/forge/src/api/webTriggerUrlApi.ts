import { webTrigger } from '@forge/api';
import { createConfig } from '../util/createConfig';
import { createFullUrl } from '../util/createFullUrl';
import { deleteConfig, getConfig, saveConfig } from './configApi';

export const getWebTriggerUrl = async (): Promise<{ data?: string; error?: string }> => {
  try {
    let config = await getConfig();

    if (!config) {
      config = createConfig();
      await saveConfig(config);
    }

    const webTriggerUrl = await webTrigger.getUrl('secure-forge-script-master-web-trigger');
    const fullUrl = createFullUrl(webTriggerUrl, config);

    return await Promise.resolve({ data: fullUrl });
  } catch (error) {
    return await Promise.resolve({ error: String(error) });
  }
};

export const recreateWebTriggerUrl = async (): Promise<{ data?: string; error?: string }> => {
  try {
    await deleteConfig();

    return await getWebTriggerUrl();
  } catch (error) {
    return await Promise.resolve({ error: String(error) });
  }
};
