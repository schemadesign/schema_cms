import React from 'react';
import { shallow } from 'enzyme';

import { CreateFilter } from '../createFilter.component';
import { defaultProps } from '../createFilter.stories';

describe('CreateFilter: Component', () => {
  const component = props => <CreateFilter {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchFieldsInfo = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({ fetchFieldsInfo });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchFieldsInfo on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchFieldsInfo');

    await render();

    expect(defaultProps.fetchFieldsInfo).toHaveBeenCalled();
  });
});
