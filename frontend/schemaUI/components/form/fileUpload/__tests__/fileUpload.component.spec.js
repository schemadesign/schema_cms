import React from 'react';
import { shallow } from 'enzyme';

import { FileUpload } from '../fileUpload.component';

describe('FileUpload: Component', () => {
  const defaultProps = {};

  const component = props => <FileUpload {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
