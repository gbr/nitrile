import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { apiFetch } from 'app/actions/bar';
import { get } from 'app/utils';

@provideHooks({
  propTypes: {
    dispatch: React.PropTypes.any,
  },
  // return the promise for server side trigger
  defer: ({ dispatch }) => dispatch(apiFetch()).payload.promise,
})
@connect(state => ({
  bar: get('bar.data')(state),
}))
class BarRoute extends React.Component {
  render() {
    return (
      <section className="BarRoute">
        <DocumentMeta extend {...{ title: 'Breko Hub - Bar' }} />
        <h3>Bar</h3>
        {this.props.bar.map((item, i) =>
          <p key={i}>{item}</p>
        )}
      </section>
    );
  }
}
BarRoute.propTypes = {
  bar: React.PropTypes.any,
};

export default BarRoute;
