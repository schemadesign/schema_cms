import React from 'react';

import { BlockElement } from '../blockElement.component';
import { defaultProps } from '../blockElement.stories';
import { makeContextRenderer } from '../../../utils/testUtils';
import { imageElement, stackElement } from '../../../../modules/page/page.mocks';
import { blockTemplates } from '../../../../modules/blockTemplates/blockTemplates.mocks';

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

  it('should render correctly stack element', async () => {
    const wrapper = await render({ element: stackElement, blockTemplates });
    expect(wrapper).toMatchSnapshot();
  });

  it('should remove block from stack element', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render({ element: stackElement, blockTemplates });
    wrapper.root.findByProps({ id: 'blockPath.elements.0.value.0' }).props.onClick();

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('blockPath.elements.0.value', []);
  });

  it('should add block to stack element', async () => {
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = await render({ element: stackElement, blockTemplates });
    wrapper.root.findByProps({ id: 'addBlockStack' }).props.onClick();

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('blockPath.elements.0.value', [
      {
        elements: [
          { id: 1, name: 'name', type: 'plain_text', value: '' },
          { id: 1, name: 'name', type: 'image', value: { fileName: 'fileName' } },
        ],
        id: 1,
        key: 1,
        name: 'name',
        type: 'type',
      },
      {
        allowAdd: false,
        block: 3,
        created: '2020-02-21T08:34:24+0000',
        createdBy: 'owner 3',
        elements: [{ id: 1, key: 1, name: 'element name', type: 'rich_text' }],
        isAvailable: false,
        key: expect.any(Number),
        name: '',
        type: 'block name 3',
      },
    ]);
  });
});
