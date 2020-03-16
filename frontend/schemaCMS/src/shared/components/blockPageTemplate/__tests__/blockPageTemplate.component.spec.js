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

  it('should remove element', async () => {
    jest.spyOn(defaultProps, 'removeElement');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'removeElement-0' }).props.onClick();

    expect(defaultProps.removeElement).toHaveBeenCalledWith(0);
  });

  it('should set type of element', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();
    wrapper.root.findAllByProps({ id: 'elementTypeSelect' })[0].props.onSelect({ value: 'value' });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('elements.0.type', 'value');
  });

  it('should set block of element', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();
    wrapper.root.findAllByProps({ id: 'elementBlockSelect' })[0].props.onSelect({ value: 'value' });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('elements.0.params.block', 'value');
  });
});
