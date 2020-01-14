import React from 'react';
import { shallow } from 'enzyme';

import { Filter } from '../filter.component';
import { defaultProps } from '../filter.stories';

describe('Filter: Component', () => {
  const component = props => <Filter {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchFilter = jest.fn().mockReturnValue(Promise.resolve({ datasource: '1' }));
    defaultProps.fetchFieldsInfo = jest.fn().mockReturnValue(Promise.resolve({}));
    const wrapper = render(defaultProps);
    await Promise.resolve();
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchFilter on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchFilter');

    await render();

    expect(defaultProps.fetchFilter).toHaveBeenCalled();
  });

  it('should call fetchFilter on componentDidMount', async () => {
    defaultProps.fetchFilter = jest.fn().mockReturnValue(Promise.resolve({ datasource: '1' }));
    jest.spyOn(defaultProps, 'fetchFieldsInfo');

    await render();

    expect(defaultProps.fetchFieldsInfo).toHaveBeenCalled();
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchFilter should return error';
    const wrapper = await render({
      fetchFilter: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
