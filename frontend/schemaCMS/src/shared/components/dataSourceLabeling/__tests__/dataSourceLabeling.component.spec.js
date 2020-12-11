import React from 'react';

import { DataSourceLabeling } from '../dataSourceLabeling.component';
import { defaultProps } from '../dataSourceLabeling.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('DataSourceLabeling: Component', () => {
  const render = props => makeContextRenderer(<DataSourceLabeling {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
