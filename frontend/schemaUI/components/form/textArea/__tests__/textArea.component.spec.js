import React from 'react';
import { mount, shallow } from 'enzyme';

import { TextArea } from '../textArea.component';

describe('TextArea: Component', () => {
  const defaultProps = {};

  const component = props => <TextArea {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props), { disableLifecycleMethods: true });

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const props = { customStyles: { padding: '10px' } };
    const wrapper = render(props);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should increase height with padding and border after change scrollHeight', () => {
    const event = { target: { value: 'value' } };
    const onChange = jest.fn();
    const props = { onChange, customStyles: { padding: '10px', border: '10px solid black', boxSizing: 'border-box' } };
    const wrapper = mount(<TextArea {...props} />);
    const textArea = wrapper.find('textarea').first();

    wrapper.instance().shadowRef = { current: { scrollHeight: 99, style: { width: 0 } } };
    textArea.simulate('change', event);

    global.expect(wrapper.instance().textAreaRef.current.style.height).toEqual('119px');
  });

  it('should change height after change scrollHeight', () => {
    const event = { target: { value: 'value' } };
    const onChange = jest.fn();
    const props = { onChange, customStyles: { padding: '10px', border: '10px solid black' } };
    const wrapper = mount(<TextArea {...props} />);
    const textArea = wrapper.find('textarea').first();

    wrapper.instance().shadowRef = { current: { scrollHeight: 99, style: { width: 0 } } };
    textArea.simulate('change', event);

    global.expect(wrapper.instance().textAreaRef.current.style.height).toEqual('79px');
  });
});
