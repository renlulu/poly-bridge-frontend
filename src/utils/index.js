import errorHandlder from './errorHandler';
import validations from './validations';

export default {
  install(Vue) {
    Vue.use(errorHandlder);
    Vue.use(validations);
  },
};
