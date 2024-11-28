import { useEffect } from 'react';
import { useState } from 'react';

const localCache = {};

const useFetch = (url) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    hasError: false,
    error: null,
  });

  useEffect(() => {
    getFetch();
  }, [url]);

  const clearLoadingState = () =>
    setState({
      data: null,
      isLoading: true,
      hasError: false,
      error: null,
    });

  const getFetch = async () => {
    if (localCache[url]) {
      console.log('using cache');
      setState({
        data: localCache[url],
        isLoading: false,
        hasError: false,
        error: null,
      });
      return;
    }

    clearLoadingState();

    const resp = await fetch(url);

    // sleep
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!resp.ok) {
      setState({
        data: null,
        isLoading: false,
        hasError: true,
        error: {
          code: resp.status,
          message: resp.statusText,
        },
      });
    }

    const data = await resp.json();
    setState({
      data,
      isLoading: false,
      hasError: false,
      error: null,
    });

    localCache[url] = data;
  };

  return {
    data: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError,
  };
};

export default useFetch;
