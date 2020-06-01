import React from 'react';

import { CreateDataSourceState } from '../createDataSourceState.component';
import { defaultProps } from '../createDataSourceState.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({
    dataSourceId: 'dataSourceId',
  }),
}));

describe('CreateDataSourceState: Component', () => {
  const render = props => makeContextRenderer(<CreateDataSourceState {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch page templates and internal connections', async () => {
    jest.spyOn(defaultProps, 'fetchDataSourceTags');
    jest.spyOn(defaultProps, 'fetchFilters');
    await render();
    expect(defaultProps.fetchDataSourceTags).toHaveBeenCalledWith({ dataSourceId: 'dataSourceId' });
    expect(defaultProps.fetchFilters).toHaveBeenCalledWith({ dataSourceId: 'dataSourceId' });
  });
});
