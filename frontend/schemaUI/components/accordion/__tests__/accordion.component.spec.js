import React from 'react';
import { shallow } from 'enzyme';

import { Accordion } from '../accordion.component';
import { AccordionPanel } from '../../accordionPanel';
import { AccordionHeader } from '../../accordionHeader';
import { AccordionDetails } from '../../accordionDetails';

describe('Accordion: Component', () => {
  const defaultProps = {};

  const component = props => (
    <Accordion {...defaultProps} {...props}>
      <AccordionPanel>
        <AccordionHeader>First Panel</AccordionHeader>
        <AccordionDetails>First Details</AccordionDetails>
      </AccordionPanel>
      <AccordionPanel>
        <AccordionHeader>Second Panel</AccordionHeader>
        <AccordionDetails>Second Details</AccordionDetails>
      </AccordionPanel>
    </Accordion>
  );

  const render = (props = {}) => shallow(component(props)).dive();

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
