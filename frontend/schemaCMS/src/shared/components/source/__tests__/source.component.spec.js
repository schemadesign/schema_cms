import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';

import { SourceComponent } from '../source.component';
import { defaultProps } from '../source.stories';
import { DEFAULT_LOCALE } from '../../../../i18n';

describe('SourceComponent: Component', () => {
  const component = props => (
    <IntlProvider locale={DEFAULT_LOCALE}>
      <SourceComponent {...defaultProps} {...props} />
    </IntlProvider>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render file uploader', () => {
    const props = {
      dataSource: {
        type: 'file',
      },
    };
    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
