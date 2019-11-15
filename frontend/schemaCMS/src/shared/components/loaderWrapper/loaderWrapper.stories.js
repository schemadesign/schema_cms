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

storiesOf('Shared Components|LoaderWrapper', module)
  .addDecorator(withTheme())
  .add('loading', () => <LoaderWrapper {...loadingProps}>{content}</LoaderWrapper>)
  .add('no data', () => <LoaderWrapper {...noDataProps}>{content}</LoaderWrapper>)
  .add('custom no data', () => <LoaderWrapper {...customNoData}>{content}</LoaderWrapper>)
  .add('loaded', () => <LoaderWrapper {...contentProps}>{content}</LoaderWrapper>)
  .add('with error', () => <LoaderWrapper {...errorProps}>{content}</LoaderWrapper>);
