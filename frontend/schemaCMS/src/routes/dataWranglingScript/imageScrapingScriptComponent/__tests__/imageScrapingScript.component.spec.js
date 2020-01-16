import React from 'react';
import { shallow } from 'enzyme';

import { ImageScrapingScript } from '../imageScrapingScript.component';
import { defaultProps } from '../imageScrapingScript.stories';
import { BackButton, NextButton } from '../../../../shared/components/navigation';
import { STEPS_PAGE } from '../../../../modules/dataSource/dataSource.constants';

describe('DataWranglingScript: Component', () => {
  defaultProps.fetchDataSource = jest.fn().mockReturnValue(
    Promise.resolve({
      activeJob: {
        scripts: {},
      },
    })
  );

  const component = props => <ImageScrapingScript {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const wrapper = render();
    await Promise.resolve();
    await Promise.resolve();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetchDataSource on mount', async () => {
    jest.spyOn(defaultProps, 'fetchDataSource');
    render();
    await Promise.resolve();
    await Promise.resolve();
    expect(defaultProps.fetchDataSource).toHaveBeenCalledWith({ dataSourceId: '1', scriptId: '1' });
  });

  it('should fetchDataWranglingScripts on mount ', async () => {
    jest.spyOn(defaultProps, 'fetchDataWranglingScripts');
    render({ dataWranglingScripts: [] });
    await Promise.resolve();
    await Promise.resolve();
    expect(defaultProps.fetchDataWranglingScripts).toHaveBeenCalledWith({ dataSourceId: '1' });
  });

  it('should go to data wrangling step', async () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();
    await Promise.resolve();
    await Promise.resolve();
    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith(`/datasource/1/${STEPS_PAGE}`, { fromScript: true });
  });

  it('should call setImageScrapingFields', async () => {
    jest.spyOn(defaultProps, 'setImageScrapingFields');
    const wrapper = render();
    await Promise.resolve();
    await Promise.resolve();
    wrapper.find(NextButton).simulate('click');

    expect(defaultProps.setImageScrapingFields).toHaveBeenCalledWith({
      dataSourceId: '1',
      imageScrapingFields: [],
      scriptId: '1',
      imageScriptIndex: 1,
    });
  });

  it('should call fetchDataSource on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchDataSource');

    await render();

    expect(defaultProps.fetchDataSource).toHaveBeenCalled();
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchDataSource should return error';
    const wrapper = await render({
      fetchDataSource: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
