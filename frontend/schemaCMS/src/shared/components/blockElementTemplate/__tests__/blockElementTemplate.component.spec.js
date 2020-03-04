import React from 'react';

import { BlockElementTemplate } from '../blockElementTemplate.component';
import { defaultProps } from '../blockElementTemplate.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('BlockElementTemplate: Component', () => {
  const render = props => makeContextRenderer(<BlockElementTemplate {...defaultProps} {...props} />);

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
