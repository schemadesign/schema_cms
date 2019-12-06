import React from 'react';
import { shallow } from 'enzyme';

import { ImageScrapingScript } from '../imageScrapingScript.component';
import { defaultProps } from '../imageScrapingScript.stories';
import { BackButton, NextButton } from '../../../../shared/components/navigation';
import mockScripts, { CASE_CONVERSION } from '../../../../modules/dataWranglingScripts/scripts.mock';
import { STEPS_PAGE } from '../../../../modules/dataSource/dataSource.constants';

describe('DataWranglingScript: Component', () => {
  const component = props => <ImageScrapingScript {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should go back on history', async () => {
    jest.spyOn(defaultProps.history, 'goBack');
    defaultProps.fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.goBack).toHaveBeenCalled();
  });

  it('should go to data wrangling step', async () => {
    jest.spyOn(defaultProps.history, 'push');
    defaultProps.fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());

    const dataWranglingScript = {
      // eslint-disable-next-line import/no-named-as-default-member
      ...mockScripts[CASE_CONVERSION],
    };
    const wrapper = render({ ...defaultProps, dataWranglingScript });
    await Promise.resolve();
    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith(`/datasource/2/${STEPS_PAGE}`);
  });

  it('should call setImageScrapingFields', async () => {
    jest.spyOn(defaultProps, 'setImageScrapingFields');
    defaultProps.fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    wrapper.find(NextButton).simulate('click');

    expect(defaultProps.setImageScrapingFields).toHaveBeenCalledWith({
      dataSourceId: '1',
      imageScrapingFields: [],
      scriptId: '1',
    });
  });
});
