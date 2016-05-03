import uuid from 'uuid';

export const REMOVE_MESSAGE = 'flash/REMOVE_MESSAGE';
export const ADD_MESSAGE = 'flash/ADD_MESSAGE';

const makeFlash = (message, type = 'info') => ({
  type,
  message,
  id: uuid.v1(),
});

export const removeMessage = (flashId) => ({
  type: REMOVE_MESSAGE,
  payload: { flashId },
});

export const addMessage = (message, type = 'info') => ({
  type: ADD_MESSAGE,
  payload: makeFlash(message, type),
});
