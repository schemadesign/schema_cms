import React from 'react';
import { act } from 'react-test-renderer';

import { PageForm } from '../pageForm.component';
import { defaultProps } from '../pageForm.stories';
import { makeContextRenderer } from '../../../utils/testUtils';
import { PAGE_TEMPLATES_BLOCKS } from '../../../../modules/pageTemplates/pageTemplates.constants';
import { page } from '../../../../modules/page/page.mocks';
import { PAGE_DISPLAY_NAME, PAGE_TAGS, PAGE_TEMPLATE } from '../../../../modules/page/page.constants';

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

  it('should render with page template', async () => {
    const wrapper = await render({ page: { ...page, [PAGE_TEMPLATE]: 2, [PAGE_TAGS]: {} } });
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
    const wrapper = await render({ values: { ...page, [PAGE_TEMPLATES_BLOCKS]: [], [PAGE_TAGS]: {} } });

    act(() => {
      wrapper.root.findByProps({ id: 'pageTemplateSelect' }).props.onSelect({ value: 'value' });
    });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('template', 'value');
  });

  it('should lower case a display name on blur', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    jest.spyOn(defaultProps, 'handleBlur');
    const wrapper = await render({ values: { ...page, [PAGE_DISPLAY_NAME]: 'VALUE', [PAGE_TAGS]: {} } });

    act(() => {
      wrapper.root.findByProps({ id: 'displayName' }).props.onBlur({ target: 'target' });
    });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('displayName', 'value');
    expect(defaultProps.handleBlur).toHaveBeenCalledWith({ target: 'target' });
  });

  it('should show change template modal and change on confirm', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    jest.spyOn(defaultProps, 'validateForm');
    jest.useFakeTimers();

    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'pageTemplateSelect' }).props.onSelect({ value: 'value' });
    });
    act(() => {
      wrapper.root.findByProps({ id: 'confirmChangeTemplateBtn' }).props.onClick();
    });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('template', 'value');
    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('blocks', []);
    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('deleteBlocks', [1]);
    jest.runAllTimers();
    expect(defaultProps.validateForm).toHaveBeenCalled();
  });

  it('should redirect to add block page', async () => {
    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'addBlock' }).props.onClick();
    });

    expect(mockPushHistory).toHaveBeenCalledWith('url/add-block', {
      page: {
        blocks: [
          {
            elements: [
              { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
              { id: 1, name: 'name', type: 'internal_connection', value: 'http://domain.com/blog' },
              { id: 1, name: 'name', type: 'state', value: 1 },
              { id: 1, name: 'name', type: 'markdown', value: '**Hello world!!!**' },
              {
                id: 1,
                name: 'name',
                type: 'observable_hq',
                value: { observableCell: 'notebook-cell', observableNotebook: 'my-notebook', observableUser: '@user' },
              },
              {
                id: 1,
                name: 'custom element',
                type: 'custom_element',
                value: [
                  {
                    elements: [
                      { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
                      { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
                      { id: 1, name: 'name', type: 'markdown', value: '**Hello world!!!**' },
                    ],
                    id: 1,
                  },
                  {
                    elements: [
                      { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
                      { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
                      { id: 1, name: 'name', type: 'markdown', value: '**Hello world!!!**' },
                    ],
                    id: 2,
                  },
                  {
                    elements: [
                      { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
                      { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
                      { id: 1, name: 'name', type: 'markdown', value: '**Hello world!!!**' },
                    ],
                    id: 3,
                  },
                ],
              },
            ],
            id: 1,
            key: 1,
            type: 'type',
          },
        ],
        deleteBlocks: [],
        description: 'description',
        displayName: 'page-name',
        id: 1,
        isPublic: false,
        keywords: 'keyword;',
        name: 'page name',
        section: { id: 'sectionId', mainPage: { displayName: 'page-name-2', id: 2 }, title: 'Section' },
        tags: {},
        template: 1,
      },
    });
  });
});
