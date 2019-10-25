import React from 'react';
import { shallow } from 'enzyme';

import { DataWranglingScript } from '../dataWranglingScript.component';
import { defaultProps } from '../dataWranglingScript.stories';
import mockScripts, { CASE_CONVERSION } from '../../../modules/dataWranglingScripts/scripts.mock';

describe('DataWranglingScript: Component', () => {
  const component = props => <DataWranglingScript {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with link to datasources', () => {
    // eslint-disable-next-line import/no-named-as-default-member
    const props = { ...defaultProps, dataWranglingScript: mockScripts[CASE_CONVERSION] };
    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
