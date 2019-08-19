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

  it('should render header with custom styles', () => {
    const header = (<h1>header</h1>);
    const headerStyles = {color: 'red'};
    const componentStyles = {color: 'blue'};

    const wrapper = shallow((
      <Card headerComponent={header} headerStyles={headerStyles} componentStyles={componentStyles}>
        <div>
          <p>Content</p>
        </div>
      </Card>
    ));

    global.expect(wrapper).toMatchSnapshot();
  });
});
