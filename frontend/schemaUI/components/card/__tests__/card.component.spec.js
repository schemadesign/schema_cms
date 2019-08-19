import React from 'react';
import { shallow } from 'enzyme';

import { Card } from '../card.component';

describe('Card: Component', () => {
  const defaultProps = {};

  const component = props => <Card {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render children when passed in', () => {
    const wrapper = shallow((
      <Card>
        <div>
          <h1>Test</h1>
          <p>Content</p>
        </div>
      </Card>
    ));

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render component  with custom style and with header', () => {
    const header = (<h1 style='color: red'>header</h1>);
    const style = {color: 'blue'};

    const wrapper = shallow((
      <Card style={style} headerComponent={header}>
        <div>
          <p>Content</p>
        </div>
      </Card>
    ));

    global.expect(wrapper).toMatchSnapshot();
  });
});
