import React from 'react';

import { StateFilterList } from '../stateFilterList.component';
import { defaultProps } from '../stateFilterList.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

describe('StateFilterList: Component', () => {
  const render = props => makeContextRenderer(<StateFilterList {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
