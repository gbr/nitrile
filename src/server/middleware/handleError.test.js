import koa from 'koa';
import mockHTTP from 'node-mocks-http';
import handleError from './handleError';

const sessionState = {};
const fakeSession = function *gen(next) {
  this.session = sessionState;
  yield next;
};

const fakeARequest = (
  app,
  req = mockHTTP.createRequest({ method: 'GET', url: '/' }),
  res = mockHTTP.createResponse()
) => {
  const sockReq = req;
  sockReq.socket = {};
  app.callback()(sockReq, res);
};

describe('Handle Error Middleware', () => {
  it('should work without session', (done) => {
    const app = koa();
    app.use(function *gen(next) {
      yield next;
      expect('everything').to.be.ok();
      done();
    });
    app.use(handleError);
    fakeARequest(app);
  });

  it('should clear any session state', (done) => {
    const app = koa();
    app.use(fakeSession);
    app.use(function *gen(next) {
      yield next;
      expect(this.session.state).to.not.exist();
      done();
    });
    app.use(handleError);
    sessionState.state = 'populated State';
    fakeARequest(app);
  });
});
