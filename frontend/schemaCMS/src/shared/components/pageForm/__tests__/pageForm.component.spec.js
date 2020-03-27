import React from 'react';
import { act } from 'react-test-renderer';

import { PageForm } from '../pageForm.component';
import { defaultProps } from '../pageForm.stories';
import { makeContextRenderer } from '../../../utils/testUtils';
import { PAGE_TEMPLATES_BLOCKS } from '../../../../modules/pageTemplates/pageTemplates.constants';
import { page } from '../../../../modules/page/page.mocks';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
  useRouteMatch: () => ({
    url: 'url',
  }),
}));

describe('PageForm: Component', () => {
  const render = props => makeContextRenderer(<PageForm {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call setRemoveModalOpen', async () => {
    jest.spyOn(defaultProps, 'setRemoveModalOpen');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'removePage' }).props.onClick();

    expect(defaultProps.setRemoveModalOpen).toHaveBeenCalledWith(true);
  });

  it('should change page template', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render({ values: { ...page, [PAGE_TEMPLATES_BLOCKS]: [] } });

    act(() => {
      wrapper.root.findByProps({ id: 'pageTemplateSelect' }).props.onSelect({ value: 'value' });
    });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('template', 'value');
  });

  it('should show change template modal and change on confirm', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'pageTemplateSelect' }).props.onSelect({ value: 'value' });
    });
    act(() => {
      wrapper.root.findByProps({ id: 'confirmChangeTemplateBtn' }).props.onClick();
    });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('template', 'value');
  });

  it('should setTemporaryPageBlocks and redirect to add block page', async () => {
    jest.spyOn(defaultProps, 'setTemporaryPageBlocks');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'addBlock' }).props.onClick();
    });

    expect(defaultProps.setTemporaryPageBlocks).toHaveBeenCalledWith([
      { elements: [{ id: 1, name: 'name', type: 'plain_text', value: '' }], id: 1, key: 1, name: 'name', type: 'type' },
    ]);
    expect(mockPushHistory).toHaveBeenCalledWith('url/add-block');
  });
});
