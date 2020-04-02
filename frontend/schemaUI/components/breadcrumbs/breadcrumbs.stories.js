import React from 'react';
import { storiesOf } from '@storybook/react';

import { Breadcrumbs } from './breadcrumbs.component';
import { withTheme } from '../../.storybook/decorators';

const SYMBOL = '/';
const COMPONENT_SYMBOL = <div>/</div>;

export const defaultProps = {};

export const withSymbol = separatorSymbol => ({
  ...defaultProps,
  separatorSymbol,
});

storiesOf('Breadcrumbs', module)
  .addDecorator(withTheme())
  .add('Default', () => (
    <Breadcrumbs {...defaultProps}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </Breadcrumbs>
  ))
  .add('With custom symbol', () => (
    <Breadcrumbs {...withSymbol(SYMBOL)}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </Breadcrumbs>
  )).add('With custom symbol as a component', () => (
    <Breadcrumbs {...withSymbol(COMPONENT_SYMBOL)}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </Breadcrumbs>
  ));
