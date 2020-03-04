import React from 'react';
import { storiesOf } from '@storybook/react';

import { AccordionPanel } from './accordionPanel.component';
import { withTheme } from '../../.storybook/decorators';
import AccordionPanelContext from './accordionPanel.context';

const defaultProps = {};

export const context = {
  open: true,
};

const decorator = story => <AccordionPanelContext.Provider value={context}>{story()}</AccordionPanelContext.Provider>;

storiesOf('Accordion/AccordionPanel', module)
  .addDecorator(withTheme())
  .addDecorator(decorator)
  .add('Default', () => <AccordionPanel {...defaultProps}>AccordionPanel</AccordionPanel>);
