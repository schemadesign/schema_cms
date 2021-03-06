import React from 'react';
import { shallow } from 'enzyme';

import { H3 } from '../h3.component';

describe('H3: Component', () => {
  const defaultProps = {};

  const component = props => <H3 {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render children when passed in', () => {
    const wrapper = shallow(<H3>Super title</H3>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const customStyles = { color: 'blue' };

    const wrapper = shallow(<H3 customStyles={customStyles}>Blue title</H3>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with attributes', () => {
    const wrapper = shallow(
      <H3 id="test-id" title="test title">
        Title with attributes
      </H3>
    );

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom theme', () => {
    const theme = {
      typography: {
        h3: {
          fontFamily: 'serif',
          size: '100px',
          color: 'gray',
        },
      },
    };

    const wrapper = shallow(<H3 theme={theme}>Title with custom theme</H3>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with overwritten styles', () => {
    const styles = { fontSize: '10px', color: 'blue' };

    const wrapper = shallow(<H3 style={styles}>Blue title with overwritten styles</H3>);

    global.expect(wrapper).toMatchSnapshot();
  });
});
