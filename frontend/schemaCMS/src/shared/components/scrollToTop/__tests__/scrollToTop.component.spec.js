import React from 'react';
import { shallow } from 'enzyme';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import { ScrollToTop } from '../scrollToTop.component';

describe('ScrollToTop: Component', () => {
  const routerProps = {
    history: createMemoryHistory(),
  };

  const component = props => (
    <Router {...routerProps}>
      <ScrollToTop {...props}/>
    </Router>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });
});
