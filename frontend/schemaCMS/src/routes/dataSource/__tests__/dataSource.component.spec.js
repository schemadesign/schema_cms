import React from 'react';
import { shallow } from 'enzyme';

import DataSource from '../dataSource.component';
import { defaultProps } from '../dataSource.stories';

describe('DataSource: Component', () => {
  const component = props => <DataSource {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render without routing', async () => {
    const fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render({ fetchDataSource });
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render({ fetchDataSource });
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });
});
