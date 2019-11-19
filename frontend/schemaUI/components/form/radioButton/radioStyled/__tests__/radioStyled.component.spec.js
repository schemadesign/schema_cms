import React from 'react';
import { shallow } from 'enzyme';

import { RadioStyled } from '../radioStyled.component';
import RadioGroupContext from '../../../radioGroup/radioGroup.context';

describe('RadioStyled: Component', () => {
  const defaultProps = {
    value: 'value',
    label: 'name',
    id: 'id',
  };

  const context = {
    name: 'name',
    onChange: () => {},
    value: null,
    customLabelStyles: {
      background: 'blue',
    },
    customCheckedStyles: {
      opacity: 0.3,
    },
  };

  const component = props => (
    <RadioGroupContext.Provider value={context}>
      <RadioStyled {...defaultProps} {...props} />
    </RadioGroupContext.Provider>
  );

  const render = (props = {}) => shallow(component(props)).dive();

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
