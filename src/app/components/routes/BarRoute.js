import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { apiFetch } from 'app/actions/bar';
import { get } from 'app/utils';
import { compose } from 'redux';

const hooks = {
  propTypes: {
    dispatch: React.PropTypes.any,
  },
  // return the promise for server side trigger
  defer: ({ dispatch }) => dispatch(apiFetch()).payload.promise,
};
const mapStateToProps = (state) => ({ bar: get('bar.data')(state) });

const BarRoute = ({ bar }) => (
  <section className="BarRoute">
    <DocumentMeta extend {...{ title: 'Breko Hub - Bar' }} />
    <h3>Bar</h3>
    {bar.map((item, i) =>
      <p key={i}>{item}</p>
    )}
  </section>
);
BarRoute.propTypes = {
  bar: React.PropTypes.any,
};

export default compose(
  provideHooks(hooks),
  connect(mapStateToProps)
)(BarRoute);
