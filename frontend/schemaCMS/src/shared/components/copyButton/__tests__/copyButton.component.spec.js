import React from 'react';

import { CopyButton } from '../copyButton.component';
import { defaultProps } from '../copyButton.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('CopyButton: Component', () => {
  const render = props => makeContextRenderer(<CopyButton {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call action', async () => {
    jest.spyOn(defaultProps, 'action');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'id' }).props.onClick();

    expect(defaultProps.action).toHaveBeenCalled();
  });
});
