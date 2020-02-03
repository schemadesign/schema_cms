import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceTagForm } from '../dataSourceTagForm.component';
import { defaultProps, propsWithTags } from '../dataSourceTagForm.stories';

describe('DataSourceTagForm: Component', () => {
  const component = props => <DataSourceTagForm {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render empty', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const form = render(propsWithTags);

    expect(form).toMatchSnapshot();
  });

  it('should call setFieldValue on input change', () => {
    jest.spyOn(propsWithTags, 'setFieldValue');

    render(propsWithTags)
      .find('[name="tags.0"]')
      .simulate('change', { target: { value: 'new value' } });

    expect(propsWithTags.setFieldValue).toHaveBeenCalledWith('tags.0', { id: 1, value: 'new value' });
  });

  it('should add new tag on enter', () => {
    jest.spyOn(propsWithTags, 'setFieldValue');

    const wrapper = render(propsWithTags);

    wrapper
      .find('[name="tags.0"]')
      .simulate('keydown', { target: { value: 'new value' }, keyCode: 13, preventDefault: Function.prototype });

    expect(propsWithTags.setFieldValue).toHaveBeenCalledWith('tags', [
      { id: 1, value: 'value' },
      { value: '' },
      { id: 'create_2', value: 'value' },
    ]);
    expect(wrapper.state()).toEqual({ focusInputIndex: 1 });
  });

  it('should remove tag on backspace', () => {
    const props = {
      setFieldValue: Function.prototype,
      values: {
        id: 2,
        datasource: { id: 1 },
        name: 'name',
        tags: [{ id: 1, value: 'value' }, { id: 'create_2', value: 'value' }, { id: 3, value: 'value' }],
        deleteTags: [],
      },
    };

    jest.spyOn(props, 'setFieldValue');

    const wrapper = render(props);

    wrapper
      .find('[name="tags.2"]')
      .simulate('keydown', { target: { value: '' }, keyCode: 8, preventDefault: Function.prototype });

    expect(props.setFieldValue).toHaveBeenCalledWith('tags', [
      { id: 1, value: 'value' },
      { id: 'create_2', value: 'value' },
    ]);
    expect(props.setFieldValue).toHaveBeenCalledWith('deleteTags', [3]);
    expect(wrapper.state()).toEqual({ focusInputIndex: 1 });
  });

  it('should remove tag on blur', () => {
    const props = {
      setFieldValue: Function.prototype,
      values: {
        id: 2,
        datasource: { id: 1 },
        name: 'name',
        tags: [{ id: 1, value: '' }, { id: 'create_2', value: 'value' }],
        deleteTags: [],
      },
    };

    jest.spyOn(props, 'setFieldValue');

    const wrapper = render(props);

    wrapper
      .find('[name="tags.0"]')
      .simulate('blur', { target: { value: '' }, keyCode: 8, preventDefault: Function.prototype });

    expect(props.setFieldValue).toHaveBeenCalledWith('tags', [{ id: 'create_2', value: 'value' }]);
    expect(wrapper.state()).toEqual({ focusInputIndex: null });
  });

  it('should set focus index', () => {
    jest.spyOn(propsWithTags, 'setFieldValue');
    const wrapper = render(propsWithTags);
    wrapper.find('[name="tags.1"]').simulate('focus');

    expect(wrapper.state()).toEqual({ focusInputIndex: 1 });
  });
});
