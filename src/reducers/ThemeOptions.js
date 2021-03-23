export const SET_ENABLE_MOBILE_MENU = 'THEME_OPTIONS/SET_ENABLE_MOBILE_MENU';
export const SET_ENABLE_MOBILE_MENU_SMALL = 'THEME_OPTIONS/SET_ENABLE_MOBILE_MENU_SMALL';

export const setEnableMobileMenu = (enableMobileMenu) => ({
  type: SET_ENABLE_MOBILE_MENU,
  enableMobileMenu,
});

export const setEnableMobileMenuSmall = (enableMobileMenuSmall) => ({
  type: SET_ENABLE_MOBILE_MENU_SMALL,
  enableMobileMenuSmall,
});

export default function reducer(state = {
  enableMobileMenuSmall: '',
  enableFixedSidebar: true,
}, action) {
  switch (action.type) {
    case SET_ENABLE_MOBILE_MENU:
      return {
        ...state,
        enableMobileMenu: action.enableMobileMenu,
      };

    case SET_ENABLE_MOBILE_MENU_SMALL:
      return {
        ...state,
        enableMobileMenuSmall: action.enableMobileMenuSmall,
      };
    default:
  }
  return state;
}
