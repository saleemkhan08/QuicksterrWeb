import {
  ADD_DISHES,
  DELETE_DISHES,
  EDIT_DISHES,
  FETCH_DISHES_BEGIN,
  FETCH_DISHES_SUCCESS,
  FETCH_DISHES_ERROR
} from "../actions/dishesActions";

const initialState = {
  dishes: [],
  isLoading: false,
  error: null,
  drawer: false
};

const DishesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DISHES_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case FETCH_DISHES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        dishes: action.payload
      };
    case FETCH_DISHES_ERROR:
      return {
        ...state,
        isLoading: false,
        dishes: []
      };

    case EDIT_DISHES:
      return {
        ...state
      };

    case DELETE_DISHES:
      return {
        ...state
      };

    case ADD_DISHES:
      return {
        ...state
      };
    default:
      return state;
  }
};

export default DishesReducer;
