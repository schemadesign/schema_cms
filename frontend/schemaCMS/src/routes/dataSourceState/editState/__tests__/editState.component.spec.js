import React from 'react';

import { EditState } from '../editState.component';
import { defaultProps } from '../editState.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({
    stateId: 'stateId',
  }),
}));

describe('EditState: Component', () => {
  const render = props => makeContextRenderer(<EditState {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should fetch states, data source tags and filters', async () => {
    jest.spyOn(defaultProps, 'fetchState');
    jest.spyOn(defaultProps, 'fetchDataSourceTags');
    jest.spyOn(defaultProps, 'fetchFilters');
    await render();
    expect(defaultProps.fetchState).toHaveBeenCalledWith({ stateId: 'stateId' });
    expect(defaultProps.fetchDataSourceTags).toHaveBeenCalledWith({ dataSourceId: 'dataSourceId' });
    expect(defaultProps.fetchFilters).toHaveBeenCalledWith({ dataSourceId: 'dataSourceId' });
  });
});
