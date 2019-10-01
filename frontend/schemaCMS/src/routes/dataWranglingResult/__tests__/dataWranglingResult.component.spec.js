import React from 'react';
import { shallow } from 'enzyme';

import { DataWranglingResult } from '../dataWranglingResult.component';
import { defaultProps } from '../dataWranglingResult.stories';

describe('DataWranglingResult: Component', () => {
  const component = props => <DataWranglingResult {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
