import React from 'react';

import { Select } from '../select.component';
import { defaultProps } from '../select.stories';
import { makeContextRenderer } from '../../../../utils/testUtils';

describe('Select: Component', () => {
  const render = props => makeContextRenderer(<Select {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render({
      value: 'one',
      onSelect: Function.prototype,
    });
    global.expect(wrapper).toMatchSnapshot();
  });
});
