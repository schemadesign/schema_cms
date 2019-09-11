import React from 'react';
import { shallow } from 'enzyme';

import { Source } from '../source.component';

describe('Source: Component', () => {
  const defaultProps = {
    values: {},
    onChange: Function.prototype,
    setFieldValue: Function.prototype,
    intl: {
      formatMessage: ({ defaultMessage }) => defaultMessage,
    },
    errors: {},
    touched: {},
    dataSource: {},
  };

  const component = props => <Source {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render file uploader', () => {
    const props = {
      values: {
        type: 'file',
      },
    };
    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
