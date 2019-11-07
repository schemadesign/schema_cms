import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { PlusButton } from '../navigation';
import { ContextHeader } from './contextHeader.component';

export const defaultProps = {
  title: 'Projects',
  subtitle: 'Overviews',
};

const longText = `
  Mauris egestas arcu nec diam consectetur vulputate.
  Mauris rhoncus a massa in ultricies. In vel accumsan tortor.
  Donec suscipit commodo enim. Suspendisse nibh odio
`;

const longProps = {
  title: longText,
  subtitle: longText,
};

storiesOf('Shared Components|Header/ContextHeader', module)
  .addDecorator(withTheme())
  .add('Default', () => <ContextHeader {...defaultProps} />)
  .add('with content', () => (
    <ContextHeader {...defaultProps}>
      <PlusButton />
    </ContextHeader>
  ))
  .add('with long text', () => (
    <ContextHeader {...longProps}>
      <PlusButton />
    </ContextHeader>
  ));
