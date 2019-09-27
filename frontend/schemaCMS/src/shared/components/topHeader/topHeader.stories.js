import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter, withTheme } from '../../../.storybook/decorators';
import { TopHeader } from './topHeader.component';

const long = 'jhdskjud jsd asd ksjd kjsdkjasdjksahd ljksdjhakjd hsdh uhdjnsdljad jsuias hj dnjakd nuas dndyasldij andjnadsaidads adiomasi dnasj ndoasdn asi';

export const defaultProps = {
  headerTitle: 'Projects',
  headerSubtitle: 'Overview',
  primaryMenuItems: [{ label: 'Data Sources', to: '/path' }, { label: 'Charts', to: '/path' }],
  secondaryMenuItems: [{ label: 'Log Out', to: '/logout' }, { label: 'Click action', onClick: () => {}, id: 'id' }],
};

storiesOf('Shared Components|TopHeader', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <TopHeader {...defaultProps} />);
