import i18n from '@/i18n';

export class BaseError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.cause = options.cause;
    this.expose = options.expose != null ? options.expose : true;
  }

  getLocalMessage() {
    return this.message;
  }

  printTraceStack() {
    console.error(this);
    for (let error = this.cause; error; error = error.cause) {
      console.error('Caused by:', error);
    }
  }
}

export class CancelledError extends BaseError {
  constructor(message, options = {}) {
    super(message, options);
    this.message = options.message != null ? options.message : 'Cancelled';
    this.expose = options.expose != null ? options.expose : false;
  }
}

export class WalletError extends BaseError {
  static CODES = {
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NOT_SUPPORTED: 'NOT_SUPPORTED',
    NOT_INSTALLED: 'NOT_INSTALLED',
    NOT_IN_MAIN_NET: 'NOT_IN_MAIN_NET',
    NOT_IN_TEST_NET: 'NOT_IN_TEST_NET',
    USER_REJECTED: 'USER_REJECTED',
    MALFORMED_INPUT: 'MALFORMED_INPUT',
    INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
    COMMUNICATE_FAILED: 'COMMUNICATE_FAILED',
  };

  constructor(message, options = {}) {
    super(message, options);
    this.code = options.code != null ? options.code : WalletError.UNKNOWN_ERROR;
  }

  getLocalMessage() {
    const { code } = this;
    if (i18n.te(`errors.wallet.${code}`)) {
      return i18n.t(`errors.wallet.${code}`);
    }
    return this.message;
  }
}

export class ChainError extends BaseError {
  static CODES = {
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NOT_SUPPORTED: 'NOT_SUPPORTED',
    COMMUNICATE_FAILED: 'COMMUNICATE_FAILED',
  };

  constructor(message, options = {}) {
    super(message, options);
    this.code = options.code != null ? options.code : ChainError.UNKNOWN_ERROR;
  }

  getLocalMessage() {
    const { code } = this;
    if (i18n.te(`errors.chain.${code}`)) {
      return i18n.t(`errors.chain.${code}`);
    }
    return this.message;
  }
}

export class HttpError extends BaseError {
  static CODES = {
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    BAD_REQUEST: 'BAD_REQUEST',
    INTERNAL_SERVICE_ERROR: 'INTERNAL_SERVICE_ERROR',
    UTXOS_UNAVAILABLE: 'UTXOS_UNAVAILABLE',
  };

  constructor(message, options = {}) {
    super(message, options);
    this.code = options.code != null ? options.code : HttpError.UNKNOWN_ERROR;
  }

  getLocalMessage() {
    const { code } = this;
    if (i18n.te(`errors.http.${code}`)) {
      return i18n.t(`errors.http.${code}`);
    }
    return this.message;
  }
}
