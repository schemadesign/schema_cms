import React from 'react';
import { shallow } from 'enzyme';

import { DataWranglingScriptComponent } from '../dataWranglingScript.component';
import { defaultProps } from '../dataWranglingScript.stories';

describe('DataWranglingScript: Component', () => {
  const component = props => <DataWranglingScriptComponent {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });
});
