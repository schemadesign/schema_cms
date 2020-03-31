import React from 'react';

import { ProjectTabs } from '../projectTabs.component';
import { defaultProps } from '../projectTabs.stories';
import { UserContext } from '../../../utils/userProvider';
import { ROLES } from '../../../../modules/userProfile/userProfile.constants';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('ProjectTabs: Component', () => {
  const render = props =>
    makeContextRenderer(
      <UserContext.Provider value={{ role: ROLES.ADMIN }}>
        <ProjectTabs {...defaultProps} {...props} />
      </UserContext.Provider>
    );

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
