import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { Select } from '../select.component';

const DEFAULT_OPTION = { value: 'default', label: 'Select your favorite from the list', selected: true };

const options = [
  { value: 'dolphin', label: 'Dolphin' },
  { value: 'dog', label: 'Dog' },
  { value: 'parrot', label: 'Parrot' },
  { value: 'cat', label: 'Cat' },
  { value: 'alligator', label: 'Alligator' },
  { value: 'spider', label: 'Spider' },
];

const optionsWithDefault = [...options, DEFAULT_OPTION];

describe('Select: Component', () => {
  const defaultProps = {
    options,
    onSelect: Function.prototype,
  };

  const component = props => <Select {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with default options', () => {
    const wrapper = render({ options: optionsWithDefault });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with native', () => {
    const wrapper = render({ native: true });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call onSelect on item select for non native', () => {
    const expected = { value: 'dolphin', label: 'Dolphin' };
    const onSelect = spy();
    const wrapper = render({ onSelect });
    wrapper.find('#select-item-0').simulate('click');

    expect(onSelect).to.have.been.calledWith(expected);
  });

  it('should call onSelect on select change for native', () => {
    const expected = { value: 'dolphin', label: 'Dolphin' };
    const onSelect = spy();
    const wrapper = render({ onSelect, native: true });
    wrapper.find('select').simulate('change', {
      target: {
        value: 'dolphin',
      },
    });

    expect(onSelect).to.have.been.calledWith(expected);
  });
});
