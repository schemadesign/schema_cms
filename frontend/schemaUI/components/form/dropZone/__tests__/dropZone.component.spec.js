import React from 'react';
import { mount, shallow } from 'enzyme';

import { DropZoneComponent } from '../dropZone.component';
import { defaultProps } from '../dropZone.stories';

describe('DropZone: Component', () => {
  const component = props => <DropZoneComponent {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render hidden', () => {
    const wrapper = render({ hidden: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not call onChange', () => {
    jest.spyOn(defaultProps, 'onChange');
    const wrapper = render();
    const args = { preventDefault: Function.prototype, dataTransfer: { files: [] } };

    wrapper.find('label').simulate('drop', args);

    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('should call onChange', () => {
    jest.spyOn(defaultProps, 'onChange');
    const wrapper = render();
    const files = [{ name: 'name.png', file: 'file', type: 'image/png' }];
    const args = { preventDefault: Function.prototype, dataTransfer: { files } };

    wrapper.find('label').simulate('drop', args);

    expect(defaultProps.onChange).toHaveBeenCalledWith(files);
  });

  it('should call onChange with accept fromats', () => {
    jest.spyOn(defaultProps, 'onChange');
    const wrapper = render({ accept: '.jpg, .gif', multiple: true });
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
    const wrapper = render();
    const files = [
      { name: 'name.jpg', file: 'file', type: 'image/jpg' },
      { name: 'name.gif', file: 'file', type: 'image/gif' },
    ];
    const args = { preventDefault: Function.prototype, dataTransfer: { files } };

    wrapper.find('label').simulate('drop', args);

    expect(defaultProps.onChange).toHaveBeenCalledWith([files[0]]);
  });

  it('should drop zone be hidden', () => {
    const wrapper = mount(component({ hidden: true }));
    const dropZoneStyles = wrapper.instance().dropRef.current.style;

    expect(dropZoneStyles.opacity).toBe('0');
    expect(dropZoneStyles.visibility).toBe('hidden');
  });

  it('should drop zone be visible on dragover', () => {
    const wrapper = mount(component({ hidden: true }));
    const event = new Event('dragenter');
    event.dataTransfer = {
      types: ['Files'],
    };
    const dropZoneStyles = wrapper.instance().dropRef.current.style;
    document.dispatchEvent(event);
    expect(dropZoneStyles.opacity).toBe('0.9');
    expect(dropZoneStyles.visibility).toBe('visible');
  });

  it('should drop zone be hidden on dragleave', () => {
    const wrapper = mount(component({ hidden: true }));
    const dragEnterEvent = new Event('dragenter');
    const dragLeaveEvent = new Event('dragleave');
    dragEnterEvent.dataTransfer = {
      types: ['Files'],
    };
    const dropZoneStyles = wrapper.instance().dropRef.current.style;
    document.dispatchEvent(dragEnterEvent);
    document.dispatchEvent(dragLeaveEvent);
    expect(dropZoneStyles.opacity).toBe('0');
    expect(dropZoneStyles.visibility).toBe('hidden');
  });

  it('should drop zone be hidden on drop', () => {
    const wrapper = mount(component({ hidden: true }));
    const dragEnterEvent = new Event('dragenter');
    const dropEvent = new Event('drop');
    dragEnterEvent.dataTransfer = {
      types: ['Files'],
    };
    const dropZoneStyles = wrapper.instance().dropRef.current.style;
    document.dispatchEvent(dragEnterEvent);
    document.dispatchEvent(dropEvent);
    expect(dropZoneStyles.opacity).toBe('0');
    expect(dropZoneStyles.visibility).toBe('hidden');
  });

  it('should drop zone still be visible', () => {
    const wrapper = mount(component({ hidden: true }));
    const dragEnterEvent = new Event('dragenter');
    const dragLeaveEvent = new Event('dragleave');
    dragEnterEvent.dataTransfer = {
      types: ['Files'],
    };
    const dropZoneStyles = wrapper.instance().dropRef.current.style;
    document.dispatchEvent(dragEnterEvent);
    document.dispatchEvent(dragEnterEvent);
    document.dispatchEvent(dragLeaveEvent);
    expect(dropZoneStyles.opacity).toBe('0.9');
    expect(dropZoneStyles.visibility).toBe('visible');
  });
});
