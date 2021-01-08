import { TOKEN_BASIC_ICONS, UNKNOWN_ICON } from '@/utils/values';

export default {
  state: {
    tokenBasicIconMap: TOKEN_BASIC_ICONS.reduce((pre, cur) => {
      return { ...pre, [cur.symbol]: cur.icon };
    }, {}),
  },
  getters: {
    getTokenBasicIcon: state => symbol => {
      if (state.tokenBasicIconMap[symbol]) {
        return state.tokenBasicIconMap[symbol];
      }
      return UNKNOWN_ICON;
    },
  },
};
