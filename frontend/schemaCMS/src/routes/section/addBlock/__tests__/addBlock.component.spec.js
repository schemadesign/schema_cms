import React from 'react';

import { AddBlock } from '../addBlock.component';
import { defaultProps } from '../addBlock.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

describe('AddBlock: Component', () => {
  const render = props => makeContextRenderer(<AddBlock {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
