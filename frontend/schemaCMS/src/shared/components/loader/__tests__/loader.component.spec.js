import React from 'react';

import { Loader } from '../loader.component';
import { defaultProps } from '../loader.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('Loader: Component', () => {
  const render = props => makeContextRenderer(<Loader {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
