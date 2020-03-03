import React from 'react';

import { BlockTemplate } from '../blockTemplate.component';
import { defaultProps } from '../blockTemplate.stories';
import { makeContextRenderer } from '../../../shared/utils/testUtils';

describe('BlockTemplate: Component', () => {
  const render = props => makeContextRenderer(<BlockTemplate {...defaultProps} {...props} />);

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
