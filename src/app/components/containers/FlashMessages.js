import { connect } from 'react-redux';
import { noop } from 'lodash';
import { removeMessage } from 'app/actions/flash';
import { bem } from 'app/utils';
import * as selectors from 'app/selectors';
import styles from './FlashMessages.module.scss';

const { PropTypes } = React;

export const Msg = ({ msg, ...props }) =>
  <span {...props} {...Msg.classes(null, msg.type, 'FlashMessages__Msg')}>
    {msg.message}
    &nbsp;
    <strong className={styles.close}>x</strong>
  </span>;

Msg.classes = bem(styles.msg);

Msg.propTypes = {
  msg: PropTypes.shape({
    type: PropTypes.oneOf(['error', 'good', 'info']),
    message: PropTypes.string,
  }).isRequired,
};

@connect(state => ({
  messages: selectors.flashMessages(state),
}), { removeMessage })
class FlashMessages extends React.Component {
  static propTypes = {
    messages: PropTypes.array,
    removeMessage: PropTypes.func,
  };

  static defaultProps = {
    messages: [],
    removeMessage: noop,
  };

  clickMessage(msg) {
    this.props.removeMessage(msg.id);
  }

  render() {
    const { messages } = this.props;
    return (
      <div className="FlashMessages">
        {messages.map(msg =>
          <Msg key={msg.id}
            msg={msg}
            onClick={() => this.clickMessage(msg)}
          />
        )}
      </div>
    );
  }
}

export default FlashMessages;
