import {
  LOGIN_USER,
  LOGOUT_USER,
  FETCH_USER,
  CHANGE_NAVBAR_COLOR,
  CHANGE_MAIN_CONTENT_TYPE,
  SET_ADMIN_STATUS,
  USERS_FETCH_SUCCESS,
  OPEN_PROFILE_DIALOG,
  CLOSE_PROFILE_DIALOG
} from "../actions/navigationActions";
const initialState = {
  isLoggedIn: false,
  isLoggingLoading: true,
  user: null,
  navbarColor: "white",
  mainContentType: "Menu",
  isAdmin: false,
  openProfileDialog: false,
  users: []
};
const NavigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_PROFILE_DIALOG:
      return {
        ...state,
        openProfileDialog: true
      };

    case CLOSE_PROFILE_DIALOG:
      return {
        ...state,
        openProfileDialog: false
      };

    case LOGIN_USER:
      return {
        ...state,
        isLoggedIn: true,
        isLoggingLoading: false,
        user: action.payload
      };

    case LOGOUT_USER:
      return {
        ...state,
        isLoggedIn: false,
        isLoggingLoading: false,
        user: null
      };
    case FETCH_USER:
      return {
        ...state,
        isLoggingLoading: true
      };
    case CHANGE_NAVBAR_COLOR:
      return {
        ...state,
        navbarColor: action.payload
      };
    case CHANGE_MAIN_CONTENT_TYPE:
      return {
        ...state,
        mainContentType: action.payload
      };
    case SET_ADMIN_STATUS:
      return {
        ...state,
        isAdmin: action.payload
      };
    case USERS_FETCH_SUCCESS:
      return {
        ...state,
        users: action.payload
      };
    default:
      return state;
  }
};

export default NavigationReducer;
