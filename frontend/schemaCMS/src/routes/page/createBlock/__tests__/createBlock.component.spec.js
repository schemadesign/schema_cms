import React from 'react';
import { shallow } from 'enzyme';

import { CreatePageBlock } from '../createPageBlock.component';
import { defaultProps } from '../createPageBlock.stories';
import {
  IMAGE_TYPE,
  MARKDOWN_TYPE,
  EMBED_TYPE,
  CODE_TYPE,
  BLOCK_TYPE,
} from '../../../../modules/pageBlock/pageBlock.constants';
import { BackButton } from '../../../../shared/components/navigation';
import { Form } from '../createPageBlock.styles';

describe('CreatePageBlock: Component', () => {
  const component = props => <CreatePageBlock {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with image type', () => {
    const wrapper = render({
      ...defaultProps,
      values: {
        type: IMAGE_TYPE,
      },
    });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with markdown type', () => {
    const wrapper = render({
      ...defaultProps,
      values: {
        type: MARKDOWN_TYPE,
      },
    });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with embed type', () => {
    const wrapper = render({
      ...defaultProps,
      values: {
        type: EMBED_TYPE,
      },
    });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with code type', () => {
    const wrapper = render({
      ...defaultProps,
      values: {
        type: CODE_TYPE,
      },
    });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with block type', () => {
    const wrapper = render({
      ...defaultProps,
      values: {
        type: BLOCK_TYPE,
      },
    });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should return to page list', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/page/1');
  });

  it('should submit form', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });
});
