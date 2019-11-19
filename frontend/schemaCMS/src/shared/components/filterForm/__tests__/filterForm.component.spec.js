import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { FilterForm } from '../filterForm.component';
import { defaultProps, createProps, editProps } from '../filterForm.stories';

describe('FilterForm: Component', () => {
  const component = props => <FilterForm {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render create form', () => {
    const form = render(createProps)
      .find(Formik)
      .dive();
    global.expect(form).toMatchSnapshot();
  });

  it('should render edit form', () => {
    const form = render(editProps)
      .find(Formik)
      .dive();
    global.expect(form).toMatchSnapshot();
  });
});
