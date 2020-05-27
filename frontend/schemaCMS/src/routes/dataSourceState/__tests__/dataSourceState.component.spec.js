import React from 'react';

import { DataSourceState } from '../dataSourceState.component';
import { project } from '../../../modules/project/project.mocks';
import { makeContextRenderer } from '../../../shared/utils/testUtils';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useRouteMatch: () => ({
    path: 'path',
  }),
  useParams: () => ({
    stateId: 'stateId',
  }),
}));

describe('DataSourceState: Component', () => {
  const defaultProps = {
    project,
    fetchState: Function.prototype,
  };

  const render = props => makeContextRenderer(<DataSourceState {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should fetch state', async () => {
    jest.spyOn(defaultProps, 'fetchState');
    await render();
    expect(defaultProps.fetchState).toHaveBeenCalledWith({ stateId: 'stateId' });
  });
});
