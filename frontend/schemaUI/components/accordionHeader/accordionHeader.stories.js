import React from 'react';
import { storiesOf } from '@storybook/react';

import { AccordionHeader } from './accordionHeader.component';
import { withTheme } from '../../.storybook/decorators';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';
import { CaretIcon } from '../icons';

const defaultProps = {};

export const context = {
  open: true,
  icon: <CaretIcon />,
};

const decorator = story => <AccordionPanelContext.Provider value={context}>{story()}</AccordionPanelContext.Provider>;

storiesOf('Accordion/Accordion Header', module)
  .addDecorator(withTheme())
  .addDecorator(decorator)
  .add('Default', () => <AccordionHeader {...defaultProps}>Header</AccordionHeader>);
