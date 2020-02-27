import React from 'react';
import { shallow } from 'enzyme';
import { Card } from 'schemaUI';

import { StatisticCards } from '../statisticCards.component';
import { defaultProps } from '../statisticCards.stories';

describe('StatisticCards: Component', () => {
  const component = props => <StatisticCards {...defaultProps} {...props} />;
  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should redirect on click on card', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();

    wrapper
      .find(Card)
      .first()
      .simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/link/to');
  });
});
