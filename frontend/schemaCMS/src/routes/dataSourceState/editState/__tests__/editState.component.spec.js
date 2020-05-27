import React from 'react';

import { EditState } from '../editState.component';
import { defaultProps } from '../editState.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

describe('EditState: Component', () => {
  const render = props => makeContextRenderer(<EditState {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
