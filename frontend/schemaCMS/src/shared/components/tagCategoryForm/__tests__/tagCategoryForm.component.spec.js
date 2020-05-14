import React from 'react';
import { act } from 'react-test-renderer';

import { TagCategoryForm, TagComponent } from '../tagCategoryForm.component';
import { defaultProps, propsWithTags } from '../tagCategoryForm.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('TagCategoryForm: Component', () => {
  const render = props => makeContextRenderer(<TagCategoryForm {...defaultProps} {...props} />);

  it('should render empty', async () => {
    const wrapper = await render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const form = await render(propsWithTags);

    expect(form).toMatchSnapshot();
  });

  it('should open remove modal', async () => {
    const props = {
      ...propsWithTags,
      openRemoveCategoryModal: Function.prototype,
    };
    jest.spyOn(props, 'openRemoveCategoryModal');
    const wrapper = await render(props);
    wrapper.root.findByProps({ id: 'removeTagCategory' }).props.onClick();

    expect(props.openRemoveCategoryModal).toHaveBeenCalled();
  });

  it('should call setFieldValue on input change', async () => {
    jest.spyOn(propsWithTags, 'setFieldValue');

    const wrapper = await render(propsWithTags);
    wrapper.root.findByProps({ name: 'tags.0' }).props.onChange({ target: { value: 'new value' } });

    expect(propsWithTags.setFieldValue).toHaveBeenCalledWith('tags.0', { id: 1, value: 'new value' });
  });

  it('should add new tag on enter', async () => {
    jest.spyOn(propsWithTags, 'setFieldValue');

    const wrapper = await render(propsWithTags);

    act(() => {
      wrapper.root
        .findByProps({ name: 'tags.0' })
        .props.onKeyDown({ target: { value: 'new value' }, keyCode: 13, preventDefault: Function.prototype });
    });

    expect(propsWithTags.setFieldValue).toHaveBeenCalledWith('tags', [
      { id: 1, value: 'value' },
      { value: '' },
      { value: 'value' },
    ]);
  });

  it('should remove tag on backspace', async () => {
    const props = {
      values: {
        id: 2,
        name: 'name',
        tags: [{ id: 1, value: 'value' }, { value: 'value' }, { id: 3, value: 'value' }],
        deleteTags: [],
      },
    };

    jest.spyOn(defaultProps, 'setFieldValue');
    jest.spyOn(defaultProps, 'validateForm');
    jest.useFakeTimers();

    const wrapper = await render(props);

    act(() => {
      wrapper.root
        .findByProps({ name: 'tags.2' })
        .props.onKeyDown({ target: { value: '' }, keyCode: 8, preventDefault: Function.prototype });
    });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('tags', [{ id: 1, value: 'value' }, { value: 'value' }]);
    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('deleteTags', [3]);
    jest.runAllTimers();
    expect(defaultProps.validateForm).toHaveBeenCalled();
  });

  it('should remove tag on blur', async () => {
    const props = {
      values: {
        id: 2,
        name: 'name',
        tags: [{ id: 1, value: '' }, { value: 'value' }],
        deleteTags: [],
      },
    };

    jest.spyOn(defaultProps, 'setFieldValue');

    const wrapper = await render(props);

    act(() => {
      wrapper.root
        .findByProps({ name: 'tags.0' })
        .props.onBlur({ target: { value: '' }, keyCode: 8, preventDefault: Function.prototype });
    });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('tags', [{ value: 'value' }]);
  });

  it('should set focus index', async () => {
    const { values } = propsWithTags;
    const tagProps = {
      setFieldValue: Function.prototype,
      handleAddTag: Function.prototype,
      value: values.tags[0].value,
      values: propsWithTags.values,
      id: values.tags[0].id,
      index: 0,
      focusInputIndex: 1,
      setFocusInputIndex: Function.prototype,
    };
    jest.spyOn(tagProps, 'setFocusInputIndex');

    const wrapper = await makeContextRenderer(<TagComponent {...tagProps} />);

    act(() => {
      wrapper.root.findByProps({ name: 'tags.0' }).props.onFocus();
    });

    expect(tagProps.setFocusInputIndex).toBeCalledWith(0);
  });
});
