import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { LoadingWrapper } from './loadingWrapper.component';

export const loadingProps = {
  loading: true,
  noData: false,
};

export const noDataProps = {
  loading: false,
  noData: true,
};

const customNoData = {
  ...noDataProps,
  noDataContent: 'No projects',
};

export const contentProps = {
  loading: false,
  noData: false,
};

export const errorProps = {
  loading: false,
  noData: false,
  error: 'Some error',
};

export const content = (
  <div style={{ color: 'white' }}>
    <h1>Test</h1>
    <h2>Ut elementum ex nulla</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec pulvinar est.</p>
  </div>
);

storiesOf('Shared Components|LoadingWrapper', module)
  .addDecorator(withTheme())
  .add('loading', () => <LoadingWrapper {...loadingProps}>{content}</LoadingWrapper>)
  .add('no data', () => <LoadingWrapper {...noDataProps}>{content}</LoadingWrapper>)
  .add('custom no data', () => <LoadingWrapper {...customNoData}>{content}</LoadingWrapper>)
  .add('loaded', () => <LoadingWrapper {...contentProps}>{content}</LoadingWrapper>)
  .add('with error', () => <LoadingWrapper {...errorProps}>{content}</LoadingWrapper>);
