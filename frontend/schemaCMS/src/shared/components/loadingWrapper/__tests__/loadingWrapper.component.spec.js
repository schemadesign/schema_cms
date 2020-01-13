import React from 'react';
import { shallow } from 'enzyme';

import { LoadingWrapper } from '../loadingWrapper.component';
import { content, contentProps, errorProps, loadingProps, noDataProps } from '../loadingWrapper.stories';

describe('LoadingWrapper: Component', () => {
  const component = props => (
    <LoadingWrapper {...contentProps} {...props}>
      {content}
    </LoadingWrapper>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when loading', () => {
    const wrapper = render(loadingProps);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when no data', () => {
    const wrapper = render(noDataProps);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render error correctly', () => {
    const wrapper = render(errorProps);
    expect(wrapper).toMatchSnapshot();
  });
});
