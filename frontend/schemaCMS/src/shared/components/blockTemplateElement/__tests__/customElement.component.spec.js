import React from 'react';

import { CustomElement } from '../customElement.component';
import { defaultProps } from '../customElement.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('CustomElement: Component', () => {
  const render = props => makeContextRenderer(<CustomElement {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should remove element', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'remove-valuePath.0' }).props.onClick();

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('valuePath', []);
  });

  it('should add element', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'add-valuePath' }).props.onClick();

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('valuePath', [
      { id: 1, order: 0, type: 'plain_text' },
      { key: expect.any(Number), order: 1, type: '', name: '' },
    ]);
  });

  it('should set type of element', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();
    wrapper.root.findAllByProps({ id: 'valuePath.0' })[0].props.onSelect({ value: 'value' });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('valuePath.0.type', 'value');
  });
});
