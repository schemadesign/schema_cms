import React from 'react';

import { PageBlock } from '../pageBlock.component';
import { defaultProps } from '../pageBlock.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('PageBlock: Component', () => {
  const render = props => makeContextRenderer(<PageBlock {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should remove block', async () => {
    jest.spyOn(defaultProps, 'removeBlock');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'valuePath.0' }).props.onClick();

    expect(defaultProps.removeBlock).toHaveBeenCalledWith(0);
  });
});
