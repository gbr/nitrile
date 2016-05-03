import chai, { expect } from 'chai';
import koa from 'koa';
import sinon from 'sinon';
import lodash from 'lodash/index';
import ramda from 'ramda/dist/ramda';
import { isBrowser } from 'app/utils/predicates';
import { makeCreateStore } from 'app/services/makeCreateStore';
import rootReducer from 'app/reducers';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.use(require('chai-generator'));

const helpers = {
  cloneApp(app) {
    const clone = koa();
    clone.keys = lodash.clone(app.keys);
    clone.middleware = lodash.clone(app.middleware);
    return clone;
  },
  createStore(initialState = {}) {
    return makeCreateStore([
      thunkMiddleware,
      promiseMiddleware(),
    ])(rootReducer, initialState);
  },
};

function setGlobals(global) {
  const glob = global;
  glob.glob = glob;
  glob.expect = expect;
  glob.sinon = sinon;
  glob._ = lodash;
  glob.R = ramda;
  glob.helpers = helpers;
  if (!glob.location.port) {
    glob.location = {
      protocol: 'http:',
      host: 'localhost:3210',
      hostname: 'localhost',
      port: '3210',
    };
  }
}

setGlobals(isBrowser ? window : GLOBAL);
