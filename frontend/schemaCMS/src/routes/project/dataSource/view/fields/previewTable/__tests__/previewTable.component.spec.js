import React from 'react';
import { shallow } from 'enzyme';

import { PreviewTable } from '../previewTable.component';
import { tableProps } from '../previewTable.stories';

describe('PreviewTable: Component', () => {
  const component = props => <PreviewTable {...tableProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
