import React from 'react';
import { shallow } from 'enzyme';

import { NotFound } from '../notFound.component';
import { defaultProps } from '../notFound.stories';

describe('NotFound: Component', () => {
  const component = props => <NotFound {...defaultProps} {...props} />;

  it('should render correctly', () => {
    const wrapper = shallow(component());

    expect(wrapper).toMatchSnapshot();
  });
});
