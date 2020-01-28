import React from 'react';
import { shallow } from 'enzyme';

import { PageBlockForm } from '../pageBlockForm.component';
import { noneProps, imageProps, markdownProps, embedProps, codeProps, multipleImages } from '../pageBlockForm.stories';
import { TextInput } from '../../form/inputs/textInput';
import { Select } from '../../form/select';
import { NONE } from '../../../../modules/pageBlock/pageBlock.constants';

describe('PageBlockForm: Component', () => {
  const component = props => <PageBlockForm {...noneProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with image type', () => {
    const wrapper = render(imageProps);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with multiple images ', () => {
    const wrapper = render(multipleImages);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with embed type', () => {
    const wrapper = render(embedProps);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with code type', () => {
    const wrapper = render(codeProps);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with markdown type', () => {
    const wrapper = render(markdownProps);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call handleChange on change of TextInput value', () => {
    jest.spyOn(noneProps, 'handleChange');

    const wrapper = render();
    wrapper
      .find(TextInput)
      .first()
      .prop('onChange')();
    expect(noneProps.handleChange).toHaveBeenCalledTimes(1);
  });

  it('should call setFieldValue on change of Select value', () => {
    jest.spyOn(noneProps, 'setFieldValue');

    const wrapper = render({
      initialValues: {
        type: NONE,
      },
    });

    wrapper
      .find(Select)
      .first()
      .prop('onSelect')({ value: 'value' });

    expect(noneProps.setFieldValue).toHaveBeenCalledTimes(1);
  });
});
