import api, { authorize, fetch, route } from '@forge/api';
import * as vm from 'node:vm';

const MAX_LOGS_PER_INVOCATION = 100;

const MAX_LOG_SIZE = 2048;

enum LogLevel {
  info = 'info',
  log = 'log',
  warn = 'warn',
  error = 'error',
}

interface LogMessage {
  level: LogLevel;
  created: number;
  details: unknown;
}

interface RunScriptResult {
  result?: unknown;
  error?: unknown;
  logs: LogMessage[];
}

const addLog = (logs: LogMessage[], level: LogLevel, args: unknown) => {
  const details = typeof args === 'number' || typeof args === 'string' || typeof args === 'boolean' || typeof args === 'undefined' || args instanceof Error
    ? String(args)
    : JSON.stringify(args);

  if (logs.length < MAX_LOGS_PER_INVOCATION) logs.push({
    level,
    created: new Date().getTime(),
    details: details.length > MAX_LOG_SIZE ? details.slice(0, MAX_LOG_SIZE) + '...' : details,
  });
};

export const runScript = async ({ script, args }: { script: string; args: Record<string, unknown> | undefined }): Promise<RunScriptResult> => {
  const logs: LogMessage[] = [];

  try {
    const wrappedConsole = {
      log: (...args: unknown[]) => { addLog(logs, LogLevel.log, args); },
      info: (...args: unknown[]) => { addLog(logs, LogLevel.info, args); },
      warn: (...args: unknown[]) => { addLog(logs, LogLevel.warn, args); },
      error: (...args: unknown[]) => { addLog(logs, LogLevel.error, args); },
    };

    const wrappedScript = `"use strict";(async () => {${script}})();`;

    const forgeGlobalsContext = {
      ...args,
      api,
      route,
      fetch,
      authorize,
      console: wrappedConsole,
      setTimeout,
      setInterval,
      setImmediate,
      clearTimeout,
      clearInterval,
      atob,
      btoa,
      encodeURI,
      encodeURIComponent,
      decodeURI,
      decodeURIComponent,
      isFinite,
      isNaN,
      parseFloat,
      parseInt,
      Array,
      Promise,
      String,
      Set,
      Boolean,
      Number,
      Map,
      JSON,
      Intl,
      Math,
      RegExp,
      Error,
      Date,
      URL,
      URLSearchParams,
    };

    const result = await vm.runInNewContext(wrappedScript, forgeGlobalsContext) as unknown;

    return { result, logs };
  } catch (error) {
    addLog(logs, LogLevel.error, String(error));

    return { error, logs };
  }
};
