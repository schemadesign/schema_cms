import React from 'react';
import { shallow } from 'enzyme';

import { PageBlockForm } from '../pageBlockForm.component';

describe('PageBlockForm: Component', () => {
  const defaultProps = {};

  const component = props => <PageBlockForm {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
