import React from 'react';

import { BlockElement } from '../blockElement.component';
import { defaultProps } from '../blockElement.stories';
import { makeContextRenderer } from '../../../utils/testUtils';
import {
  customElement,
  imageElement,
  fileElement,
  internalConnectionElement,
  markdownElement,
  observableHQElement,
} from '../../../../modules/page/page.mocks';

describe('BlockElement: Component', () => {
  const render = props => makeContextRenderer(<BlockElement {...defaultProps} {...props} />);

  it('should render correctly text element', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly image element', async () => {
    const wrapper = await render({ element: imageElement });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly image element', async () => {
    const wrapper = await render({ element: fileElement });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly internal connection element', async () => {
    const wrapper = await render({ element: internalConnectionElement });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly markdown element', async () => {
    const wrapper = await render({ element: markdownElement });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly observable element', async () => {
    const wrapper = await render({ element: observableHQElement });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly custom element', async () => {
    const wrapper = await render({ element: customElement });
    expect(wrapper).toMatchSnapshot();
  });

  it('should remove elements set', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    jest.spyOn(defaultProps, 'validateForm');
    jest.useFakeTimers();
    const wrapper = await render({ element: customElement });
    wrapper.root.findByProps({ id: 'remove-blockPath.elements.0.value.0' }).props.onClick();

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('blockPath.elements.0.deleteElementsSets', [1]);
    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('blockPath.elements.0.value', [
      {
        elements: [
          { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
          { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
          { id: 1, name: 'name', type: 'markdown', value: '**Hello world!!!**' },
        ],
        id: 2,
        order: 0,
      },
      {
        elements: [
          { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
          { id: 1, name: 'name', type: 'plain_text', value: 'plain text value' },
          { id: 1, name: 'name', type: 'markdown', value: '**Hello world!!!**' },
        ],
        id: 3,
        order: 1,
      },
    ]);
    jest.runAllTimers();
    expect(defaultProps.validateForm).toHaveBeenCalled();
  });

  it('should add elements set', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render({ element: customElement });
    wrapper.root.findByProps({ id: 'add-blockPath.elements.0.value' }).props.onClick();
    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('blockPath.elements.0.value', [
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
      { elements: [], key: 1575162000000, order: 3 },
    ]);
  });

  it('should set file name and file in form', async () => {
    const readAsDataURL = jest.fn();
    const result = { target: { result: 'result' } };
    const addEventListener = jest.fn((_, evtHandler) => {
      evtHandler(result);
    });
    const dummyFileReader = { addEventListener, readAsDataURL };
    window.FileReader = jest.fn(() => dummyFileReader);
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render({ element: imageElement });
    wrapper.root
      .findByProps({ id: `${defaultProps.blockPath}.elements.${defaultProps.index}.value` })
      .props.onChange({ currentTarget: { files: [{ name: 'name' }] } });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('blockPath.elements.0.value.file', 'result');
    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('blockPath.elements.0.value.fileName', 'name');
  });
});
