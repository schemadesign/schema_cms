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

  it('should fetch page templates and internal connections', async () => {
    jest.spyOn(defaultProps, 'fetchDataSourceTags');
    jest.spyOn(defaultProps, 'fetchTagCategories');
    await render();
    expect(defaultProps.fetchDataSourceTags).toHaveBeenCalledWith({ dataSourceId: 1 });
    expect(defaultProps.fetchTagCategories).toHaveBeenCalledWith({ projectId: 1, type: 'dataset' });
  });
});
