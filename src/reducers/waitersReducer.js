import {
  FETCH_WAITERS_BEGIN,
  FETCH_WAITERS_SUCCESS
} from "../actions/waitersActions";

const initialState = {
  waiters: [],
  isLoading: true,
  error: null,
  drawer: false
};

const WaitersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WAITERS_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case FETCH_WAITERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        waiters: action.payload
      };

    default:
      return state;
  }
};

export default WaitersReducer;
