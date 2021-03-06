import { filter } from 'ramda';
import { typeToReducer, get } from 'app/utils';
import { REMOVE_MESSAGE, ADD_MESSAGE } from 'app/actions/flash';

const getFlashId = get(['payload', 'flashId']);
const initialState = { messages: [] };

export const flashReducers = typeToReducer({

  [REMOVE_MESSAGE]: (state, action) => ({
    ...state,
    messages: filter(
      (flash) => flash.id !== getFlashId(action),
      state.messages
    ),
  }),

  [ADD_MESSAGE]: (state, action) => ({
    ...state,
    messages: [...state.messages, action.payload],
  }),

}, initialState);
