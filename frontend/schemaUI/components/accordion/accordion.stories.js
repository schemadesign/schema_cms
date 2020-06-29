import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';

import { Accordion } from './accordion.component';
import { AccordionHeader } from '../accordionHeader';
import { AccordionDetails } from '../accordionDetails';
import { AccordionPanel } from '../accordionPanel';
import { withTheme } from '../../.storybook/decorators';

export const defaultProps = {
  collapseCopy: 'Collapse button',
  expandCopy: 'Expand button',
};

class TestComponent extends PureComponent {
  render() {
    return (
      <Accordion {...defaultProps}>
        <AccordionPanel id={1}>
          <AccordionHeader>First Panel</AccordionHeader>
          <AccordionDetails>First Details</AccordionDetails>
        </AccordionPanel>
        <AccordionPanel id={2}>
          <AccordionHeader>Second Panel</AccordionHeader>
          <AccordionDetails>Second Details</AccordionDetails>
        </AccordionPanel>
      </Accordion>
    );
  }
}

storiesOf('Accordion/Accordion', module)
  .addDecorator(withTheme())
  .add('Default', () => <TestComponent />);
