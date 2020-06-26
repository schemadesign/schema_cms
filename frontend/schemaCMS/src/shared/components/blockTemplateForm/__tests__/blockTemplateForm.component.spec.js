import React from 'react';
import { act } from 'react-test-renderer';

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
      { key: expect.any(Number), name: '', params: {}, type: '' },
      { id: 1, key: 1, name: 'element name', type: 'plain_text' },
      {
        id: 2,
        key: 2,
        name: 'element name',
        params: { elements: [{ id: 3, type: 'plain_text' }] },
        type: 'custom_element',
      },
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
      elements: [
        {
          id: 2,
          key: 2,
          name: 'element name',
          params: { elements: [{ id: 3, type: 'plain_text' }] },
          type: 'custom_element',
        },
      ],
      id: 1,
      isAvailable: true,
      name: 'block name',
    });
  });

  it('should call setRemoveModalOpen', async () => {
    jest.spyOn(defaultProps, 'setRemoveModalOpen');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'removeBlock' }).props.onClick();

    expect(defaultProps.setRemoveModalOpen).toHaveBeenCalledWith(true);
  });

  it('should call copyBlockTemplate', async () => {
    jest.spyOn(defaultProps, 'copyBlockTemplate');
    const wrapper = await render();

    await act(async () => {
      await wrapper.root.findByProps({ id: 'blockTemplateCopyButton' }).props.onClick();
    });

    expect(defaultProps.copyBlockTemplate).toHaveBeenCalledWith({ blockTemplateId: 'blockTemplateId' });
  });

  it('should call copyBlockTemplate from modal', async () => {
    jest.spyOn(defaultProps, 'copyBlockTemplate');
    const wrapper = await render({ dirty: true });

    await act(async () => {
      await wrapper.root.findByProps({ id: 'blockTemplateCopyButton' }).props.onClick();
      await wrapper.root.findByProps({ id: 'confirmCopyBtn' }).props.onClick();
    });

    expect(defaultProps.copyBlockTemplate).toHaveBeenCalledWith({ blockTemplateId: 'blockTemplateId' });
  });
});
