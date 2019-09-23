import React from 'react';
import { storiesOf } from '@storybook/react';

import { PreviewTable } from './previewTable.component';

export const tableProps = {
  data: [
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
  ],
  fields: {
    'First Name': {},
    'Last Name': {},
    'Full Name': {},
    Birthplace: {},
    'State of Birth': {},
    Birthday: {},
    Url: {},
  },
};

storiesOf('Project/DataSource/View/Fields/PreviewTable', module).add('Default', () => <PreviewTable {...tableProps} />);
