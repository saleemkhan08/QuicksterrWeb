export const SHOW_MESSAGE = "SHOW_MESSAGE";
export const CLOSE_MESSAGE = "CLOSE_MESSAGE";

export const showMessage = (message, action, actionBtnName) => ({
  type: SHOW_MESSAGE,
  payload: { message, action, actionBtnName }
});

export const closeMessage = () => ({
  type: CLOSE_MESSAGE
});

export const customAction = action => ({
  type: action
});
