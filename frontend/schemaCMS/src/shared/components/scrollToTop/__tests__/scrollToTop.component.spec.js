import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router';

import { ScrollToTop } from '../scrollToTop.component';
import { defaultProps } from '../scrollToTop.stories';

describe('ScrollToTop: Component', () => {
  const routerProps = {
    keyLength: defaultProps.keyLength,
  };

  const component = props => (
    <MemoryRouter {...routerProps}>
      <ScrollToTop {...props} />
    </MemoryRouter>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });
});
