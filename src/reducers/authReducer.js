import {
  LOGIN_USER,
  LOGOUT_USER,
  FETCH_USER,
  CHANGE_NAVBAR_COLOR,
  CHANGE_MAIN_CONTENT_TYPE
} from "../actions/authActions";

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

const initialState = {
  isLoggedIn: false,
  isLoggingLoading: true,
  user: null,
  navbarColor: "white",
  mainContentType: "Menu"
};

export default AuthReducer;