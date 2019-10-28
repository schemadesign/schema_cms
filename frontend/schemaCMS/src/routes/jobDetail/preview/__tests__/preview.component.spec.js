import React from 'react';
import { shallow } from 'enzyme';

import { Preview } from '../preview.component';
import { defaultProps } from '../preview.stories';

describe('Preview: Component', () => {
  const component = props => <Preview {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchPreview = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });
});
