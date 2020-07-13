import React from 'react';

import { BlockTemplateElement } from '../blockTemplateElement.component';
import { defaultProps } from '../blockTemplateElement.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('BlockTemplateElement: Component', () => {
  const render = props => makeContextRenderer(<BlockTemplateElement {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should remove element', async () => {
    jest.spyOn(defaultProps, 'removeElement');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'removeElement-0' }).props.onClick();

    expect(defaultProps.removeElement).toHaveBeenCalledWith(0);
  });
});
