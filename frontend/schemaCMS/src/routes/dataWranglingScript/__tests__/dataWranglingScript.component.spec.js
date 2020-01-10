import React from 'react';
import { shallow } from 'enzyme';

import { DataWranglingScript } from '../dataWranglingScript.component';
import { defaultProps } from '../dataWranglingScript.stories';
import mockScripts, { CASE_CONVERSION } from '../../../modules/dataWranglingScripts/scripts.mock';
import { IMAGE_SCRAPING_SCRIPT_TYPE } from '../../../modules/dataWranglingScripts/dataWranglingScripts.constants';

describe('DataWranglingScript: Component', () => {
  const component = props => <DataWranglingScript {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with link to datasources', async () => {
    defaultProps.fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());
    const props = {};
    const wrapper = render(props);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with route to custom script', async () => {
    defaultProps.fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());

    const dataWranglingScript = {
      // eslint-disable-next-line import/no-named-as-default-member
      ...mockScripts[CASE_CONVERSION],
      specs: {
        type: IMAGE_SCRAPING_SCRIPT_TYPE,
      },
    };

    const wrapper = render({ dataWranglingScript });
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchDataWranglingScript on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchDataWranglingScript');

    await render();

    expect(defaultProps.fetchDataWranglingScript).toHaveBeenCalled();
  });
});
