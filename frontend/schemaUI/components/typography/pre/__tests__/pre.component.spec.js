import React from 'react';
import { shallow } from 'enzyme';

import { Pre } from '../pre.component';

describe('Pre: Component', () => {
  const defaultProps = {};

  const component = props => <Pre {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render children when passed in', () => {
    const wrapper = shallow(<Pre>Short paragraph</Pre>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const customStyles = { color: 'blue' };

    const wrapper = shallow(<Pre customStyles={customStyles}>Paragraph with custom styles</Pre>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with attributes', () => {
    const wrapper = shallow(
      <Pre id="test-id" title="test title">
        Pre tag with attributes
      </Pre>
    );

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom theme', () => {
    const theme = {
      typography: {
        pre: {
          fontFamily: 'sans-serif',
          size: '100px',
          color: 'gray',
        },
      },
    };

    const wrapper = shallow(<Pre theme={theme}>Pre tag with custom theme</Pre>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with overwritten styles', () => {
    const styles = { fontSize: '10px', color: 'blue' };

    const wrapper = shallow(<Pre style={styles}>Pre tag with overwritten styles</Pre>);

    global.expect(wrapper).toMatchSnapshot();
  });
});
