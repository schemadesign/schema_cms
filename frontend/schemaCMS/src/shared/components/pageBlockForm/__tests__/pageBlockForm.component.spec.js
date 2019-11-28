import React from 'react';
import { shallow } from 'enzyme';

import { PageBlockForm } from '../pageBlockForm.component';
import { noneProps, imageProps, markdownProps, embedProps, codeProps } from '../pageBlockForm.stories';

describe('PageBlockForm: Component', () => {
  const component = props => <PageBlockForm {...noneProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with image type', () => {
    const wrapper = render(imageProps);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with embed type', () => {
    const wrapper = render(embedProps);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with code type', () => {
    const wrapper = render(codeProps);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with markdown type', () => {
    const wrapper = render(markdownProps);
    global.expect(wrapper).toMatchSnapshot();
  });
});
