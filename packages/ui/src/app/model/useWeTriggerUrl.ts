import { invoke } from '@forge/bridge';
import { useEffect, useState } from 'react';

interface GetWebTriggerResponse {
  data?: string;
  error?: string;
}

interface State {
  weTriggerUrl?: string;
  error?: string;
  isLoading: boolean;
}

export const useWeTriggerUrl = () => {
  const [state, setState] = useState<State>({ isLoading: true });

  useEffect(() => {
    void (async () => {
      try {
        const { data, error } = await invoke<GetWebTriggerResponse>('GetWebTriggerUrl');
        if (error) throw new Error(error);

        setState(prevState => ({ ...prevState, weTriggerUrl: data, isLoading: false }));
      } catch (error) {
        setState(prevState => ({ ...prevState, error: String(error), isLoading: false }));
      }
    })();
  }, []);

  const recreate = async () => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, weTriggerUrl: undefined, error: undefined }));

      const { data, error } = await invoke<GetWebTriggerResponse>('RecreateWebTriggerUrl');
      if (error) throw new Error(error);

      setState(prevState => ({ ...prevState, weTriggerUrl: data, isLoading: false }));
    } catch (error) {
      setState(prevState => ({ ...prevState, error: String(error), isLoading: false }));
    }
  };

  return {
    weTriggerUrl: state.weTriggerUrl,
    error: state.error,
    isLoading: state.isLoading,
    recreate,
  };
};
