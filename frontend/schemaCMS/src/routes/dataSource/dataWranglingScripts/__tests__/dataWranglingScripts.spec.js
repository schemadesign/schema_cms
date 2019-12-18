import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { DataWranglingScripts } from '../dataWranglingScripts.component';
import { defaultProps } from '../dataWranglingScripts.stories';

describe('DataWranglingScripts: Component', () => {
  const component = props => <DataWranglingScripts {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly form', async () => {
    const wrapper = await render()
      .find(Formik)
      .dive();
    global.expect(wrapper).toMatchSnapshot();
  });
});
