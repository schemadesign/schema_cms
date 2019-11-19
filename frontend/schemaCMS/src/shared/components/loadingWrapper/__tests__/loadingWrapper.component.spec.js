import React from 'react';
import { shallow } from 'enzyme';

import { LoadingWrapper } from '../loadingWrapper.component';
import { content, contentProps, errorProps, loadingProps, noDataProps } from '../loadingWrapper.stories';

describe('LoaderWrapper: Component', () => {
  const component = props => (
    <LoadingWrapper {...contentProps} {...props}>
      {content}
    </LoadingWrapper>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when loading', () => {
    const wrapper = render(loadingProps);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when no data', () => {
    const wrapper = render(noDataProps);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render error correctly', () => {
    const wrapper = render(errorProps);
    global.expect(wrapper).toMatchSnapshot();
  });
});
