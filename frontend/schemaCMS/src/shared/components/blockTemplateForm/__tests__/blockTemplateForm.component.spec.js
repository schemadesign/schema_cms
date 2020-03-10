import React from 'react';

import { BlockTemplateForm } from '../blockTemplateForm.component';
import { defaultProps } from '../blockTemplateForm.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('BlockTemplateForm: Component', () => {
  const render = props => makeContextRenderer(<BlockTemplateForm {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should add new element', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();
    wrapper.root.findAllByProps({ id: 'createElement' })[0].props.onClick();

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('elements', [
      { key: 'box-0', name: '', params: {}, type: '', autoOpen: true },
      { id: 1, name: 'element name', params: { block: 'block name 2' }, type: 'stack' },
    ]);
  });

  it('should remove element', async () => {
    jest.spyOn(defaultProps, 'setValues');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'removeElement-0' }).props.onClick();

    expect(defaultProps.setValues).toHaveBeenCalledWith({
      created: '2020-02-21T08:34:24+0000',
      createdBy: 'owner',
      deleteElements: [1],
      elements: [],
      id: 1,
      name: 'block name',
      allowAdd: false,
      isAvailable: true,
    });
  });
});