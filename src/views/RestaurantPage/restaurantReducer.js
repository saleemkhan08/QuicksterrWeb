import {
  ADD_RESTAURANTS,
  DELETE_RESTAURANTS,
  EDIT_RESTAURANTS,
  FETCH_RESTAURANTS_BEGIN,
  FETCH_RESTAURANTS_SUCCESS,
  FETCH_CURRENT_RESTAURANT_BEGIN,
  FETCH_CURRENT_RESTAURANT_SUCCESS,
  RESET_CURRENT_RESTAURANT,
  STOP_LOADING
} from "./restaurantActions";

const initialState = {
  restaurants: [],
  isLoading: true,
  isCurrentRestaurantLoading: true,
  error: null,
  drawer: false,
  currentRestaurant: undefined
};

const RestaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case STOP_LOADING:
      return {
        ...state,
        isLoading: false,
        isCurrentRestaurantLoading: false
      };
    case RESET_CURRENT_RESTAURANT:
      return {
        ...state,
        isLoading: true,
        isCurrentRestaurantLoading: true,
        currentRestaurant: undefined
      };
    case FETCH_RESTAURANTS_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_CURRENT_RESTAURANT_BEGIN:
      return {
        ...state,
        isCurrentRestaurantLoading: true
      };
    case FETCH_RESTAURANTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        restaurants: action.payload,
        isCurrentRestaurantLoading: false
      };
    case FETCH_CURRENT_RESTAURANT_SUCCESS:
      return {
        ...state,
        isCurrentRestaurantLoading: false,
        currentRestaurant: action.payload
      };

    case EDIT_RESTAURANTS:
      return {
        ...state
      };

    case DELETE_RESTAURANTS:
      return {
        ...state
      };

    case ADD_RESTAURANTS:
      return {
        ...state
      };
    default:
      return state;
  }
};

export default RestaurantReducer;
