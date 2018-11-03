import { SHOW_MESSAGE, CLOSE_MESSAGE } from "../actions/messageActions";

const initialState = {
  show: false,
  message: "",
  action: "",
  actionBtnName: ""
};

const MessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MESSAGE:
      return {
        ...state,
        show: true,
        message: action.payload.message,
        action: action.payload.action,
        actionBtnName: action.payload.actionBtnName
      };
    case CLOSE_MESSAGE:
      return {
        ...state,
        show: false
      };
    default:
      return state;
  }
};

export default MessageReducer;
