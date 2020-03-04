import React from 'react';
import { shallow } from 'enzyme';

import { AccordionHeader } from '../accordionHeader.component';
import { context } from '../accordionHeader.stories';
import AccordionPanelContext from '../../accordionPanel/accordionPanel.context';

describe('AccordionHeader: Component', () => {
  const defaultProps = {};

  const component = props => (
    <AccordionPanelContext.Provider value={context}>
      <AccordionHeader {...defaultProps} {...props}>
        AccordionHeader
      </AccordionHeader>
    </AccordionPanelContext.Provider>
  );

  const render = (props = {}) => shallow(component(props)).dive();

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
