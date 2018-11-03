import {
  ADD_CATEGORIES,
  DELETE_CATEGORIES,
  EDIT_CATEGORIES,
  FETCH_CATEGORIES_BEGIN,
  FETCH_CATEGORIES_SUCCESS,
  DISPLAY_CATEGORIES_TAB,
  HIDE_CATEGORIES_TAB,
  SET_CURRENT_CATEGORY
} from "../actions/menuActions";

const initialState = {
  categories: [],
  isLoading: true,
  error: null,
  drawer: false,
  displayCategories: false,
  currentCategory: undefined
};

const MenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        categories: action.payload
      };
    case DISPLAY_CATEGORIES_TAB:
      return {
        ...state,
        displayCategories: true
      };
    case HIDE_CATEGORIES_TAB:
      return {
        ...state,
        displayCategories: false
      };
    case SET_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.payload
      };
    case EDIT_CATEGORIES:
      return {
        ...state
      };

    case DELETE_CATEGORIES:
      return {
        ...state
      };

    case ADD_CATEGORIES:
      return {
        ...state
      };
    default:
      return state;
  }
};

export default MenuReducer;
