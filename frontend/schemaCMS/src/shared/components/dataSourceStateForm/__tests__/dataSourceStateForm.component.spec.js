import React from 'react';

import { DataSourceStateForm } from '../dataSourceStateForm.component';
import { defaultProps } from '../dataSourceStateForm.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('DataSourceStateForm: Component', () => {
  const render = props => makeContextRenderer(<DataSourceStateForm {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
