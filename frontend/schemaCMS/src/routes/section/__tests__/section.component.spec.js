import React from 'react';

import { Section } from '../section.component';
import { makeContextRenderer } from '../../../shared/utils/testUtils';

describe('Section: Component', () => {
  const render = props => makeContextRenderer(<Section {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
