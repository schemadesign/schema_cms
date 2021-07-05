import React from 'react';
import { shallow } from 'enzyme';

import { DataWranglingResult } from '../dataWranglingResult.component';
import { defaultProps } from '../dataWranglingResult.stories';

describe('DataWranglingResult: Component', () => {
  const component = props => <DataWranglingResult {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loading', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchPreview = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render(defaultProps);

    expect(wrapper).toMatchSnapshot();
  });

  it('should redirect on no job', async () => {
    jest.spyOn(defaultProps.history, 'push');

    render({
      dataSource: {
        ...defaultProps.dataSource,
        activeJob: null,
      },
    });

    expect(defaultProps.history.push).toBeCalledWith('/datasource/1/source');
  });
});
