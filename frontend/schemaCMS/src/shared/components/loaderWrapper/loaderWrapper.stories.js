import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { LoaderWrapper } from './loaderWrapper.component';

export const loadingProps = {
  loading: true,
  noData: false,
};

export const noDataProps = {
  loading: false,
  noData: true,
};

export const contentProps = {
  loading: false,
  noData: false
};

export const content = (
  <div style={{color: 'white'}}>
    <h1>Test</h1>
    <h2>Ut elementum ex nulla</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec pulvinar est.</p>
  </div>
);

storiesOf('Shared Components|LoaderWrapper', module)
  .addDecorator(withTheme())
  .add('Loading', () => <LoaderWrapper {...loadingProps}>{content}</LoaderWrapper>)
  .add('No data', () => <LoaderWrapper {...noDataProps}>{content}</LoaderWrapper>)
  .add('Loaded', () => <LoaderWrapper {...contentProps}>{content}</LoaderWrapper>);
