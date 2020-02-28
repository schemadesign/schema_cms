import React from 'react';

import { BlockTemplates } from '../blockTemplates.component';
import { defaultProps } from '../blockTemplates.stories';

import { makeContextRenderer } from '../../../../shared/utils/testUtils';

describe('BlockTemplates: Component', () => {
  const render = props => makeContextRenderer(<BlockTemplates {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();

    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
