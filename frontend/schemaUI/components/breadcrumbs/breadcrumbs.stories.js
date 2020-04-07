import React from 'react';
import { storiesOf } from '@storybook/react';

import { Breadcrumbs } from './breadcrumbs.component';
import { withTheme } from '../../.storybook/decorators';
import { LinkItem } from '../linkItem';
import { H3, Span } from '../typography';

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
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is a page</H3>
      </LinkItem>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is an inner page</H3>
      </LinkItem>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is another inner page</H3>
      </LinkItem>
    </Breadcrumbs>
  ))
  .add('single item', () => (
    <Breadcrumbs {...defaultProps}>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is a page</H3>
      </LinkItem>
    </Breadcrumbs>
  ))
  .add('With custom symbol', () => (
    <Breadcrumbs {...withSymbol(SYMBOL)}>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is a page</H3>
      </LinkItem>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is an inner page</H3>
      </LinkItem>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is another inner page</H3>
      </LinkItem>
    </Breadcrumbs>
  ))
  .add('With custom symbol as a component', () => (
    <Breadcrumbs {...withSymbol(COMPONENT_SYMBOL)}>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is a page</H3>
      </LinkItem>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is an inner page</H3>
      </LinkItem>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is another inner page</H3>
      </LinkItem>
    </Breadcrumbs>
  ))
  .add('With custom link item', () => (
    <Breadcrumbs {...withSymbol(COMPONENT_SYMBOL)}>
      <LinkItem
        render={styles => (
          <div style={styles}>
            <Span>Details</Span>
            <H3>This is a page</H3>
          </div>
        )}
      />
      <LinkItem
        render={styles => (
          <div style={styles}>
            <Span>Details</Span>
            <H3>This is an inner page</H3>
          </div>
        )}
      />
    </Breadcrumbs>
  ));
