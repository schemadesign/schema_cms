import React from 'react';
import { shallow } from 'enzyme';

import { Span } from '../span.component';

describe('Span: Component', () => {
  const defaultProps = {};

  const component = props => <Span {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render children when passed in', () => {
    const wrapper = shallow(<Span>Short text</Span>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const customStyles = { color: 'blue' };

    const wrapper = shallow(<Span customStyles={customStyles}>Span with styles</Span>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with attributes', () => {
    const wrapper = shallow(
      <Span id="test-id" title="test title">
        Span with attributes
      </Span>
    );

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom theme', () => {
    const theme = {
      typography: {
        span: {
          fontFamily: 'serif',
          size: '100px',
          color: 'gray',
        },
      },
    };

    const wrapper = shallow(<Span theme={theme}>Span with custom theme</Span>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with overwritten styles', () => {
    const styles = { fontSize: '10px', color: 'blue' };

    const wrapper = shallow(<Span style={styles}>Paragraph with overwritten styles</Span>);

    global.expect(wrapper).toMatchSnapshot();
  });
});
