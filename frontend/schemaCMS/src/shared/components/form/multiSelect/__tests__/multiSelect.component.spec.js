import React from 'react';

import { MultiSelect } from '../multiSelect.component';
import { defaultProps } from '../multiSelect.stories';
import { makeContextRenderer } from '../../../../utils/testUtils';

describe('MultiSelect: Component', () => {
  const render = props => makeContextRenderer(<MultiSelect {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
