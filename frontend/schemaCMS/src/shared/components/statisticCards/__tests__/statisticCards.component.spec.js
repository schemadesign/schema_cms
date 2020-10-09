import React from 'react';
import { shallow } from 'enzyme';

import { StatisticCards } from '../statisticCards.component';
import { defaultProps } from '../statisticCards.stories';

describe('StatisticCards: Component', () => {
  const component = props => <StatisticCards {...defaultProps} {...props} />;
  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
