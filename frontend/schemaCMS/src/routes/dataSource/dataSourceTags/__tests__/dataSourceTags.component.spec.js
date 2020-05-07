import React from 'react';

import { DataSourceTags } from '../dataSourceTags.component';
import { defaultProps } from '../dataSourceTags.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

describe('DataSourceTags: Component', () => {
  const render = props => makeContextRenderer(<DataSourceTags {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
