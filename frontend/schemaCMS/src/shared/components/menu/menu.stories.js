/* eslint no-alert:0 */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { Icons } from 'schemaUI';

import { Menu } from './menu.component';

const defaultProps = {
  open: true,
  onClose: () => alert('Close menu'),
};

const showAllHidden = {
  ...defaultProps,
  primaryItems: [{ name: 'charts', visible: true }, { name: 'pages', visible: true }],
  secondaryItems: [{ name: 'userSettings', visible: true }, { name: 'adminSettings', visible: true }],
};

const addOwnItems = {
  ...defaultProps,
  primaryItems: [{ name: 'editProjectSettings', label: 'Edit Project Settings', path: '/project/1/settings/edit' }],
  secondaryItems: [
    { name: 'deleteProject', label: 'Delete project (click here)', onClick: () => alert('Are you sure?') },
  ],
};

const allInOne = {
  ...defaultProps,
  customStyles: {
    background: '#7b67b3',
    color: '#fff',
  },
  customCloseIconStyles: {
    fill: '#fff',
    height: '50px',
    width: '50px',
  },
  customCloseButtonStyles: {
    background: '#54467b',
    height: '50px',
    width: '50px',
    right: '10px',
  },
  primaryItems: [
    { name: 'charts', label: 'Charts (click here)', visible: true, onClick: () => alert('Charts') },
    { name: 'dataSources', visible: false },
  ],
  secondaryItems: [{ name: 'userSettings', visible: true, label: 'My settings' }, { name: 'hello', label: 'Hello' }],
};

storiesOf('Shared Components/Menu', module)
  .add('Default', () => <Menu {...defaultProps} />)
  .add('show all hiden items', () => <Menu {...showAllHidden} />)
  .add('add own items', () => <Menu {...addOwnItems} />)
  .add('add custom elemets', () => (
    <Menu>
      <p style={{ borderTop: '2px solid red', borderBottom: '2px solid orange', padding: '10px 0' }}>
        <i style={{ color: 'blue', fontSize: 20 }}> italic text</i>
      </p>
      <Icons.ArrowLeftIcon />
    </Menu>
  ))
  .add('all changes in one', () => (
    <Menu {...allInOne}>
      <div style={{ padding: '10px', background: '#fff', color: '#000' }}>
        <Icons.EditIcon customStyles={{ verticalAlign: 'middle' }} />
        <span style={{ verticalAlign: 'middle' }}>Rectangle</span>
      </div>
    </Menu>
  ));
