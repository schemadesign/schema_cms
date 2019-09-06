import React from 'react';
import { shallow } from 'enzyme';

import { PreviewTableComponent as PreviewTable } from '../previewTable.component';

describe('PreviewTable: Component', () => {
  const defaultProps = {};

  const component = props => <PreviewTable {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
