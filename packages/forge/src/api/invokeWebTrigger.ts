import { runScript } from '../model/runScript';
import { getConfig } from './configApi';

interface WebTriggerRequest {
  method: string;
  headers: object;
  body: string;
  path: string;
  queryParameters: Record<string, string[]>;
  context: object;
}

interface WebTriggerResponse {
  body?: string;
  headers?: Record<string, string[]>;
  statusCode: number;
  statusText?: string;
}

const getQuickResponse = async (statusCode: number, statusText: string): Promise<WebTriggerResponse> => {
  return Promise.resolve({
    body: JSON.stringify({
      statusCode,
      statusText,
    }),
    headers: { 'Content-Type': ['application/json'] },
    statusCode,
    statusText,
  });
};

/*
  Expected requests:
    GET – Check API status
    POST – Submit a script for execution
*/
export const webtrigger = async (request: WebTriggerRequest): Promise<WebTriggerResponse> => {
  if (!request.queryParameters.version) {
    return getQuickResponse(400, 'Missing "version" query parameter');
  }
  if (!request.queryParameters.token) {
    return getQuickResponse(400, 'Missing "token" query parameter');
  }

  const config = await getConfig();
  if (!config?.token) {
    return getQuickResponse(400, 'App not initialized. Please configure it first.');
  }
  if (config.token !== request.queryParameters.token[0]) {
    return getQuickResponse(403, 'Invalid token');
  }

  if (request.method === 'GET') {
    return getQuickResponse(202, 'Accepted. Ready to serve.');
  }

  if (request.method !== 'POST') {
    return getQuickResponse(405, 'Method Not Allowed');
  }

  const { script, args } = JSON.parse(request.body) as { script: string; args: Record<string, unknown> | undefined };
  const { result, error, logs } = await runScript({ script, args });

  return Promise.resolve({
    body: JSON.stringify({
      result, error, logs,
    }),
    headers: { 'Content-Type': ['application/json'] },
    statusCode: 200,
    statusText: 'OK',
  });
};
