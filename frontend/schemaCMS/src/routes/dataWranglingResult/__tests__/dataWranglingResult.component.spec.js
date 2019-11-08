import React from 'react';
import { shallow } from 'enzyme';

import { DataWranglingResult } from '../dataWranglingResult.component';
import { defaultProps } from '../dataWranglingResult.stories';
import { DATA_WRANGLING_STEP } from '../../../modules/dataSource/dataSource.constants';

describe('DataWranglingResult: Component', () => {
  const component = props => <DataWranglingResult {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loading', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchResult = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should fetch results', async () => {
    jest.spyOn(defaultProps, 'fetchResult');
    render();

    expect(defaultProps.fetchResult).toBeCalledWith({ dataSourceId: '1' });
  });

  it("should redirect to step 3 if jobs doesn't exist", async () => {
    jest.spyOn(defaultProps.history, 'push');
    defaultProps.dataSource.jobs = [];
    render(defaultProps);

    expect(defaultProps.history.push).toBeCalledWith(
      `/datasource/${defaultProps.match.params.dataSourceId}/${DATA_WRANGLING_STEP}`
    );
  });
});
