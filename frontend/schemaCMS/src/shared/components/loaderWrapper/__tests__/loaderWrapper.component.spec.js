import React from 'react';
import { shallow } from 'enzyme';

import { LoaderWrapper } from '../loaderWrapper.component';
import { contentProps, content } from '../loaderWrapper.stories';

describe('LoaderWrapper: Component', () => {
  const component = props => <LoaderWrapper {...contentProps} {...props}>{content}</LoaderWrapper>;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
