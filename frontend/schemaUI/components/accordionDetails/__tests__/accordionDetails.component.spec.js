import React from 'react';
import { mount } from 'enzyme';

import { AccordionDetails } from '../accordionDetails.component';
import AccordionPanelContext from '../../accordionPanel/accordionPanel.context';
import { context } from '../accordionDetails.stories';

describe('AccordionDetails: Component', () => {
  const defaultProps = {};

  const component = props => (
    <AccordionPanelContext.Provider value={context}>
      <AccordionDetails {...defaultProps} {...props}>
        AccordionDetails
      </AccordionDetails>
    </AccordionPanelContext.Provider>
  );

  const render = (props = {}) => mount(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
