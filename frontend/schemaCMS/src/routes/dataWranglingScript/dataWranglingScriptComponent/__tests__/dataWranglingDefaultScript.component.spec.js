import React from 'react';
import { shallow } from 'enzyme';

import { DataWranglingDefaultScript } from '../dataWranglingDefaultScript.component';
import { defaultProps } from '../dataWranglingDefaultScript.stories';
import { BackButton } from '../../../../shared/components/navigation';
import mockScripts, { CASE_CONVERSION } from '../../../../modules/dataWranglingScripts/scripts.mock';
import { STEPS_PAGE } from '../../../../modules/dataSource/dataSource.constants';

describe('DataWranglingDefaultScript: Component', () => {
  const component = props => <DataWranglingDefaultScript {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchDataWranglingScript = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render(defaultProps);

    expect(wrapper).toMatchSnapshot();
  });

  it('should go to data wrangling page', async () => {
    jest.spyOn(defaultProps.history, 'push');
    defaultProps.fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());

    const dataWranglingScript = {
      // eslint-disable-next-line import/no-named-as-default-member
      ...mockScripts[CASE_CONVERSION],
    };
    const wrapper = await render({ ...defaultProps, dataWranglingScript });

    wrapper.find(BackButton).simulate('click');
    expect(defaultProps.history.push).toHaveBeenCalledWith(`/datasource/2/${STEPS_PAGE}`, { fromScript: true });
  });

  it('should go to data wrangling page with id from match params', async () => {
    jest.spyOn(defaultProps.history, 'push');
    defaultProps.fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render();

    wrapper.find(BackButton).simulate('click');
    expect(defaultProps.history.push).toHaveBeenCalledWith(`/datasource/dataSourceId/${STEPS_PAGE}`, {
      fromScript: true,
    });
  });
});
