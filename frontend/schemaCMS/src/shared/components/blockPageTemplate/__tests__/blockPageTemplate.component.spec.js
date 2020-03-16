import React from 'react';

import { BlockPageTemplate } from '../blockPageTemplate.component';
import { defaultProps } from '../blockPageTemplate.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('PageBlockTemplate: Component', () => {
  const render = props => makeContextRenderer(<BlockPageTemplate {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should remove block', async () => {
    jest.spyOn(defaultProps, 'removeBlock');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'removeBlock-0' }).props.onClick();

    expect(defaultProps.removeBlock).toHaveBeenCalledWith(0);
  });

  it('should set type of block', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();
    wrapper.root.findAllByProps({ id: 'blockTypeSelect' })[0].props.onSelect({ value: 'value' });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('blocks.0.block', 'value');
  });
});
