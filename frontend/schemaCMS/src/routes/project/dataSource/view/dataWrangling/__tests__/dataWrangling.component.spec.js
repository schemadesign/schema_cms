import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';

import { DataWrangling } from '../dataWrangling.component';
import { defaultProps } from '../dataWrangling.stories';
import { DEFAULT_LOCALE } from '../../../../../../i18n';

describe('DataWrangling: Component', () => {
  const component = props => (
    <IntlProvider locale={DEFAULT_LOCALE}>
      <DataWrangling {...defaultProps} {...props} />
    </IntlProvider>
  );

  const render = (props = {}) => mount(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
