import { API_VERSION } from '../model/const';
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

const getQuickResponse = (statusCode: number, statusText: string): WebTriggerResponse => ({
  body: JSON.stringify({ statusCode, statusText }),
  headers: { 'Content-Type': ['application/json'] },
  statusCode,
  statusText,
});

/*
  Expected requests:
    GET – Check API status
    POST – Submit a script for execution
*/
export const webtrigger = async (request: WebTriggerRequest): Promise<WebTriggerResponse> => {
  if (!request.queryParameters.version) {
    return getQuickResponse(400, 'Missing "version" query parameter');
  }
  if (request.queryParameters.version[0] !== API_VERSION) {
    return getQuickResponse(400, `Unsupported API version. Expected: ${API_VERSION}`);
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

  try {
    const body = JSON.parse(request.body) as { script?: unknown; args?: unknown };
    const { script, args } = body;

    if (typeof script !== 'string' || script.trim().length === 0) {
      return getQuickResponse(400, 'Request body must contain a non-empty "script" string');
    }
    if (args !== undefined && (typeof args !== 'object' || Array.isArray(args) || args === null)) {
      return getQuickResponse(400, '"args" must be a plain object if provided');
    }

    const { result, error, logs } = await runScript({ script, args: args as Record<string, unknown> | undefined });

    return {
      body: JSON.stringify({ result, error, logs }),
      headers: { 'Content-Type': ['application/json'] },
      statusCode: 200,
      statusText: 'OK',
    };
  } catch (error) {
    return getQuickResponse(400, `Invalid request: ${String(error)}`);
  }
};
