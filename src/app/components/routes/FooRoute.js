import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import { fooGet, fooGetClientOnly } from 'app/actions/foo';
import { get } from 'app/utils';
import { compose } from 'redux';

// Example hooks
const hooks = {
  propTypes: {
    dispatch: React.PropTypes.any,
  },
  // prefetch both for server side and client side render
  prefetch: ({ dispatch }) => dispatch(fooGet()),
  // defer hook only on client
  defer: ({ dispatch }) => dispatch(fooGetClientOnly()),
};
const mapStateToProps = (state) => ({
  foo: get('foo.data')(state),
});
const FooRoute = ({ foo }) => (
  <section className="FooRoute">
    <h3>Foo</h3>
    <span>{foo}</span>
  </section>
);
FooRoute.propTypes = {
  foo: React.PropTypes.any,
};

export default compose(
  provideHooks(hooks),
  connect(mapStateToProps)
)(FooRoute);
