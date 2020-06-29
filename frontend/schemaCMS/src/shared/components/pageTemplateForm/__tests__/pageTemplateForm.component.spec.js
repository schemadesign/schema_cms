import React from 'react';
import { act } from 'react-test-renderer';

import { PageTemplateForm } from '../pageTemplateForm.component';
import { defaultProps } from '../pageTemplateForm.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('PageTemplateForm: Component', () => {
  const render = props => makeContextRenderer(<PageTemplateForm {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should add new block', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();
    wrapper.root.findAllByProps({ id: 'createBlock' })[0].props.onClick();

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('blocks', [
      { block: '', key: 1575162000000 },
      { block: 1, id: 1, key: 1 },
    ]);
  });

  it('should call setRemoveModalOpen', async () => {
    jest.spyOn(defaultProps, 'setRemoveModalOpen');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'removePage' }).props.onClick();

    expect(defaultProps.setRemoveModalOpen).toHaveBeenCalledWith(true);
  });

  it('should call copyPageTemplate', async () => {
    jest.spyOn(defaultProps, 'copyPageTemplate');
    const wrapper = await render();

    await act(async () => {
      await wrapper.root.findByProps({ id: 'pageTemplateCopyButton' }).props.onClick();
    });

    expect(defaultProps.copyPageTemplate).toHaveBeenCalledWith({ pageTemplateId: 'pageTemplateId' });
  });

  it('should call copyBlockTemplate from modal', async () => {
    jest.spyOn(defaultProps, 'copyPageTemplate');
    const wrapper = await render({ dirty: true });

    await act(async () => {
      await wrapper.root.findByProps({ id: 'pageTemplateCopyButton' }).props.onClick();
      await wrapper.root.findByProps({ id: 'confirmCopyBtn' }).props.onClick();
    });

    expect(defaultProps.copyPageTemplate).toHaveBeenCalledWith({ pageTemplateId: 'pageTemplateId' });
  });
});
