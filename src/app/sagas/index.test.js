import rootSaga, { timeoutRemoveFlash, takeFlashMessages } from './index';
import { select, fork, take } from 'redux-saga/effects';
import * as selectors from 'app/selectors';
import { ADD_MESSAGE } from 'app/actions/flash';

describe('Saga Tests', () => {
  describe('Root Saga', () => {
    beforeEach(() => {
      this.saga = rootSaga();
    });

    it('should call select with nextFlashMessage', () => {
      const nextFlash = { ret: 'value' };
      expect(this.saga.next()).to.deep.yield(select(selectors.nextFlashMessage));
      expect(this.saga.next(nextFlash)).to.deep.yield(fork(timeoutRemoveFlash, nextFlash));
      expect(this.saga.next()).to.deep.yield(fork(takeFlashMessages));
    });
  });

  describe('takeFlashMessages', () => {
    beforeEach(() => {
      this.saga = takeFlashMessages();
    });

    it('should call take with an add_message', () => {
      const takeReturn = { payload: { fake: 'stuff' } };
      expect(this.saga.next()).to.deep.yield(take(ADD_MESSAGE));
      expect(this.saga.next(takeReturn))
        .to.deep.yield(fork(timeoutRemoveFlash, takeReturn.payload));
      expect(this.saga.next().done).to.eql(false);
    });
  });

  describe.skip('timeoutRemoveFlash', () => {
    beforeEach(() => {
      this.saga = timeoutRemoveFlash();
    });
  });
});
