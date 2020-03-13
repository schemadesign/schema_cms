import React from 'react';

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
      { autoOpen: true, key: 1575162000000, name: '', type: '' },
      { id: 1, key: 1, name: 'block name', type: 'block type' },
    ]);
  });

  it('should call setRemoveModalOpen', async () => {
    jest.spyOn(defaultProps, 'setRemoveModalOpen');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'removePage' }).props.onClick();

    expect(defaultProps.setRemoveModalOpen).toHaveBeenCalledWith(true);
  });
});
