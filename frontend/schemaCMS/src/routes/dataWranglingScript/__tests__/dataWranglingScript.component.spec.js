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

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = await render({ fetchDataWranglingScript });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with link to datasources', async () => {
    const fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      fetchDataWranglingScript,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with route to custom script', async () => {
    const fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());
    const dataWranglingScript = {
      // eslint-disable-next-line import/no-named-as-default-member
      ...mockScripts[CASE_CONVERSION],
      specs: {
        type: IMAGE_SCRAPING_SCRIPT_TYPE,
      },
    };
    const wrapper = await render({
      fetchDataWranglingScript,
      dataWranglingScript,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchDataWranglingScript on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchDataWranglingScript');

    await render();

    expect(defaultProps.fetchDataWranglingScript).toHaveBeenCalled();
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchDataWranglingScript should return error';
    const wrapper = await render({
      fetchDataWranglingScript: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
