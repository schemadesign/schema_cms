import React from 'react';
import { storiesOf } from '@storybook/react';

import { AccordionDetails } from './accordionDetails.component';
import { withTheme } from '../../.storybook/decorators';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';

const defaultProps = {};

export const context = {
  open: true,
};

const decorator = story => <AccordionPanelContext.Provider value={context}>{story()}</AccordionPanelContext.Provider>;

storiesOf('Accordion/Accordion Details', module)
  .addDecorator(withTheme())
  .addDecorator(decorator)
  .add('Default', () => <AccordionDetails {...defaultProps}>Details</AccordionDetails>);
