import React from 'react';
import { mount } from 'enzyme';

import { AccordionPanel } from '../accordionPanel.component';
import { context } from '../accordionPanel.stories';
import AccordionPanelContext from '../accordionPanel.context';

describe('AccordionPanel: Component', () => {
  const defaultProps = {
    id: 1,
  };

  const component = props => (
    <AccordionPanelContext.Provider value={context}>
      <AccordionPanel {...defaultProps} {...props}>
        AccordionPanel
      </AccordionPanel>
    </AccordionPanelContext.Provider>
  );

  const render = (props = {}) => mount(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
