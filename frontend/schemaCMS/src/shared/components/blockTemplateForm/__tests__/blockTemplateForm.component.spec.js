import React from 'react';

import { BlockTemplateForm } from '../blockTemplateForm.component';
import { defaultProps } from '../blockTemplateForm.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('BlockTemplateForm: Component', () => {
  const render = props => makeContextRenderer(<BlockTemplateForm {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
