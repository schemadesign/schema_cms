import React from 'react';
import { shallow } from 'enzyme';

import { DataWranglingDefaultScript } from '../dataWranglingDefaultScript.component';
import { defaultProps } from '../dataWranglingDefaultScript.stories';

describe('DataWranglingDefaultScript: Component', () => {
  const component = props => <DataWranglingDefaultScript {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render(defaultProps);

    expect(wrapper).toMatchSnapshot();
  });
});
