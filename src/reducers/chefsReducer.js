import {
  FETCH_CHEFS_BEGIN,
  FETCH_CHEFS_SUCCESS,
  FETCH_CHEFS_ERROR
} from "../actions/chefsActions";

const initialState = {
  chefs: [],
  isLoading: true,
  error: null,
  drawer: false
};

const ChefsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHEFS_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case FETCH_CHEFS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        chefs: action.payload
      };
    case FETCH_CHEFS_ERROR:
      return {
        ...state,
        isLoading: false,
        chefs: []
      };
    default:
      return state;
  }
};

export default ChefsReducer;
