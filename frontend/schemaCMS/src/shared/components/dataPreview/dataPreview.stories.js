import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import DataPreview from './dataPreview.component';
import { STATUS_DONE } from '../../../modules/dataSource/dataSource.constants';

const previewTable = [
  {
    'First Name': 'George',
    'Last Name': 'Washington',
    'Full Name': 'George Washington',
    Birthplace: 'Westmoreland County',
    'State of Birth': 'VA',
    Birthday: '02/22/1732',
    Url: 'some.url.com',
  },
  {
    'First Name': 'John',
    'Last Name': 'Adams',
    'Full Name': 'John Adams',
    Birthplace: 'Braintree',
    'State of Birth': 'MA',
    Birthday: '10/30/1735',
    Url: 'some.url.com',
  },
  {
    'First Name': 'Thomas',
    'Last Name': 'Jefferson',
    'Full Name': 'Thomas Jefferson',
    Birthplace: 'Shadwell',
    'State of Birth': 'VA',
    Birthday: '04/13/1743',
    Url: 'some.url.com',
  },
  {
    'First Name': 'James',
    'Last Name': 'Madison',
    'Full Name': 'James Madison',
    Birthplace: 'Port Conway',
    'State of Birth': 'VA',
    Birthday: '03/16/1751',
    Url: 'some.url.com',
  },
  {
    'First Name': 'James',
    'Last Name': 'Monroe',
    'Full Name': 'James Monroe',
    Birthplace: 'Monroe Hall',
    'State of Birth': 'VA',
    Birthday: '04/28/1758',
    Url: 'some.url.com',
  },
];

const fields = {
  'First Name': {},
  'Last Name': {},
  'Full Name': {},
  Birthplace: {},
  'State of Birth': {},
  Birthday: {},
  Url: {},
};

const dataSource = {
  id: 1,
  project: 1,
  status: STATUS_DONE,
};

export const defaultProps = {
  fields,
  previewTable,
  fetchFields: Function.prototype,
  unmountFields: Function.prototype,
  match: {
    params: {
      step: '2',
    },
  },
  history: {
    push: Function.prototype,
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  dataSource,
};

storiesOf('DataSource/View/Fields', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default', () => <DataPreview {...defaultProps} />);
