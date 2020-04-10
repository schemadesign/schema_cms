import React from 'react';

import { BlockElement } from '../blockElement.component';
import { defaultProps } from '../blockElement.stories';
import { makeContextRenderer } from '../../../utils/testUtils';
import { imageElement } from '../../../../modules/page/page.mocks';

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
});
