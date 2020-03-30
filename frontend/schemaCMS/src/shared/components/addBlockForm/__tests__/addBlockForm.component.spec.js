import React from 'react';

import { AddBlockForm } from '../addBlockForm.component';
import { defaultProps } from '../addBlockForm.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('AddBlockForm: Component', () => {
  const render = props => makeContextRenderer(<AddBlockForm {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
