import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceTag } from '../dataSourceTag.component';
import { defaultProps } from '../dataSourceTag.stories';

describe('Tag: Component', () => {
  const component = props => <DataSourceTag {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchTag = jest.fn().mockReturnValue(Promise.resolve({ datasource: '1' }));
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchTag on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchTag');

    await render();

    expect(defaultProps.fetchTag).toHaveBeenCalled();
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchTag should return error';
    const wrapper = await render({
      fetchTag: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
