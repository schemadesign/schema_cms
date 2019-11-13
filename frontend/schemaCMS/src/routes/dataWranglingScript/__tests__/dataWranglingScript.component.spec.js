import React from 'react';
import { shallow } from 'enzyme';

import { DataWranglingScript } from '../dataWranglingScript.component';
import { defaultProps } from '../dataWranglingScript.stories';
import mockScripts, { CASE_CONVERSION } from '../../../modules/dataWranglingScripts/scripts.mock';

describe('DataWranglingScript: Component', () => {
  const component = props => <DataWranglingScript {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with link to datasources', async () => {
    defaultProps.fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());
    // eslint-disable-next-line import/no-named-as-default-member
    const props = { ...defaultProps, dataWranglingScript: mockScripts[CASE_CONVERSION] };
    const wrapper = render(props);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });
});
