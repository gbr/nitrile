import DocumentMeta from 'react-document-meta';
import HeadNavigation from 'app/components/HeadNavigation';
import FlashMessages from 'app/components/containers/FlashMessages';
import App from './App';
import { shallow } from 'enzyme';
import styles from './App.module.scss';
import avatarPath from 'assets/avatar.jpeg';

describe('App Component', () => {
  beforeEach(function setTree() {
    this.tree = shallow(<App />);
  });

  it('renders a div tag with className', function renderDivTag() {
    const div = this.tree.find('div').first();
    expect(div).to.have.length(1);
    expect(div.hasClass(styles.app)).to.eql(true);
  });

  it('renders a document meta', function renderDocumentMeta() {
    expect(this.tree.find(DocumentMeta)).to.have.length(1);
  });

  it('renders a head navigation component', function renderHeadNavigationComponent() {
    expect(this.tree.find(HeadNavigation)).to.have.length(1);
  });

  it('renders a flash messages component', function renderFlashMessagesComponent() {
    expect(this.tree.find(FlashMessages)).to.have.length(1);
  });

  it('renders an image with src alt and width', function renderImage() {
    const img = this.tree.find('img');
    expect(img).to.have.length(1);
    expect(img.props()).to.shallowDeepEqual({
      src: avatarPath,
      alt: 'me',
      width: 70,
    });
  });

  it('renders the title', function renderTitle() {
    const title = this.tree.find('h1');
    expect(title).to.have.length(1);
    expect(title.text()).to.contain('Breko Hub');
  });

  it('renders the children in a main', function renderChildren() {
    const children = <p><span>test</span><span>child</span></p>;
    this.tree = shallow(<App>{children}</App>);
    const childTree = shallow(children);
    const content = this.tree.find(`.${styles.content}`);
    expect(content.type()).to.eql('main');
    expect(content.find('p').html()).to.eql(childTree.html());
  });
});
