import React from 'react';

import { LinkPreview } from '../linkPreview.component';
import { defaultProps } from '../linkPreview.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('LinkPreview: Component', () => {
  const render = props => makeContextRenderer(<LinkPreview {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
