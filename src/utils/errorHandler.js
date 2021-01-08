import { Message } from 'element-ui';

import { BaseError } from './errors';

export function dispatchGlobalError(error) {
  if (error) {
    const event = new ErrorEvent('error', {
      error,
      message: error.message || 'global error event',
    });
    window.dispatchEvent(event);
  }
}

function handleGlobalError(error) {
  if (error instanceof BaseError) {
    if (error.expose) {
      const localMessage = error.getLocalMessage();
      if (localMessage) {
        Message({ message: localMessage, type: 'error' });
      }
      error.printTraceStack();
    }
    return;
  }
  console.error(error);
}

export default {
  install(Vue) {
    Vue.config.errorHandler = error => handleGlobalError(error);

    window.addEventListener('error', event => {
      event.preventDefault();
      handleGlobalError(event.error);
    });

    window.addEventListener('unhandledrejection', event => {
      event.preventDefault();
      handleGlobalError(event.reason);
    });
  },
};
