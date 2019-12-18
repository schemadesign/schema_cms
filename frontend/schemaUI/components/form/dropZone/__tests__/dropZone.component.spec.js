import React from 'react';
import { shallow } from 'enzyme';

import { DropZone } from '../dropZone.component';

describe('DropZone: Component', () => {
  const defaultProps = {
    onChange: Function.prototype,
  };

  const component = props => <DropZone {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render()
      .dive()
      .dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render hidden', () => {
    const wrapper = render({ hidden: true })
      .dive()
      .dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('should not call onChange', () => {
    jest.spyOn(defaultProps, 'onChange');
    const wrapper = render()
      .dive()
      .dive();
    const args = { preventDefault: Function.prototype, dataTransfer: { files: [] } };

    wrapper.find('label').simulate('drop', args);

    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('should call onChange', () => {
    jest.spyOn(defaultProps, 'onChange');
    const wrapper = render()
      .dive()
      .dive();
    const files = [{ name: 'name.png', file: 'file', type: 'image/png' }];
    const args = { preventDefault: Function.prototype, dataTransfer: { files } };

    wrapper.find('label').simulate('drop', args);

    expect(defaultProps.onChange).toHaveBeenCalledWith(files);
  });

  it('should call onChange with accept fromats', () => {
    jest.spyOn(defaultProps, 'onChange');
    const wrapper = render({ accept: '.jpg, .gif', multiple: true })
      .dive()
      .dive();
    const acceptFiles = [
      { name: 'name.jpg', file: 'file', type: 'image/jpg' },
      { name: 'name.gif', file: 'file', type: 'image/gif' },
    ];
    const files = [...acceptFiles, { name: 'name.png', file: 'file', type: 'image/png' }];
    const args = { preventDefault: Function.prototype, dataTransfer: { files } };

    wrapper.find('label').simulate('drop', args);

    expect(defaultProps.onChange).toHaveBeenCalledWith(acceptFiles);
  });

  it('should call onChange with one file', () => {
    jest.spyOn(defaultProps, 'onChange');
    const wrapper = render()
      .dive()
      .dive();
    const files = [
      { name: 'name.jpg', file: 'file', type: 'image/jpg' },
      { name: 'name.gif', file: 'file', type: 'image/gif' },
    ];
    const args = { preventDefault: Function.prototype, dataTransfer: { files } };

    wrapper.find('label').simulate('drop', args);

    expect(defaultProps.onChange).toHaveBeenCalledWith([files[0]]);
  });
});
