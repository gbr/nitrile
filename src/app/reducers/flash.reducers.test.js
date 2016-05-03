import { flashReducers } from './flash.reducers';
import { REMOVE_MESSAGE } from 'app/actions/flash';

describe('Flash Reducers', () => {
  it('should return the initial state', () => {
    expect(flashReducers(undefined, {})).to.eql({ messages: [] });
  });

  context('Given State Has Messages', () => {
    const messages = [
      { id: 'abc' },
      { id: 'def' },
      { id: 'ghi' },
    ];
    const stateWithMessages = { messages };

    describe('REMOVE_FLASH action', () => {
      const removeFlashAction = Object.freeze({
        type: REMOVE_MESSAGE,
        payload: {
          flashId: _.sample(messages).id,
        },
      });
      const updateFlashId = () => {
        removeFlashAction.payload.flashId = _.sample(messages).id;
      };

      it('does nothing when the flashId isn\'t contained', () => {
        function assertStateUnchanged(state, flashId) {
          removeFlashAction.payload.flashId = flashId;
          expect(
            flashReducers(state, removeFlashAction)
          ).to.eql(state);
        }
        assertStateUnchanged(stateWithMessages, void 0);
        assertStateUnchanged(stateWithMessages, 'not-contained');
        assertStateUnchanged(stateWithMessages, 99);
        assertStateUnchanged(stateWithMessages, {});
        assertStateUnchanged(stateWithMessages, '');
      });

      it('removes a message by id', () => {
        _.times(6, () => {
          updateFlashId();
          const nextState = flashReducers(stateWithMessages, removeFlashAction);
          const expectedMessages = _.reject(messages, {
            id: removeFlashAction.payload.flashId,
          });
          expect(nextState).to.eql({
            messages: expectedMessages,
          });
        });
      });
    });
  });
});
