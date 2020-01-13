import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';

import { SourceFormComponent } from '../sourceForm.component';
import { defaultProps } from '../sourceForm.stories';
import { TextInput } from '../../form/inputs/textInput';
import { DEFAULT_LOCALE } from '../../../../i18n';

describe('SourceFormComponent: Component', () => {
  const component = props => (
    <IntlProvider locale={DEFAULT_LOCALE}>
      <SourceFormComponent {...defaultProps} {...props} />
    </IntlProvider>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render file uploader', () => {
    const props = {
      dataSource: {
        type: 'file',
      },
    };
    const wrapper = render(props);

    expect(wrapper).toMatchSnapshot();
  });

  it('should call handleChange on change of TextInput value', () => {
    jest.spyOn(defaultProps, 'handleChange');

    const wrapper = render();

    wrapper
      .dive()
      .find(TextInput)
      .first()
      .prop('onChange')();

    expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
  });
});
