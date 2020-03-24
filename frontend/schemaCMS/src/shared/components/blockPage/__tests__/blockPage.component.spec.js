import React from 'react';

import { BlockPage } from '../blockPage.component';
import { defaultProps } from '../blockPage.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('BlockPage: Component', () => {
  const render = props => makeContextRenderer(<BlockPage {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should remove block', async () => {
    jest.spyOn(defaultProps, 'removeBlock');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'removeBlock-0' }).props.onClick();

    expect(defaultProps.removeBlock).toHaveBeenCalledWith(0);
  });
});
