import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import { FilterForm } from '../filterForm.component';
import { createProps, editProps } from '../filterForm.stories';
import { DEFAULT_LOCALE } from '../../../../i18n';

describe('FilterForm: Component', () => {
  const defaultProps = {};
  const component = props => (
    <IntlProvider locale={DEFAULT_LOCALE}>
      <FilterForm {...defaultProps} {...props} />
    </IntlProvider>
  );

  const render = (props = {}) => mount(component(props));

  it('should render create form', () => {
    const wrapper = render(createProps);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render edit form', () => {
    const wrapper = render(editProps);
    global.expect(wrapper).toMatchSnapshot();
  });
});
