import React from 'react';

import { BlockElement } from '../blockElement.component';
import { defaultProps } from '../blockElement.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('BlockElement: Component', () => {
  const render = props => makeContextRenderer(<BlockElement {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
