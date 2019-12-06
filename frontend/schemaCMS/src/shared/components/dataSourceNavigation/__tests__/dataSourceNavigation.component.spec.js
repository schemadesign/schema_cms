import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceNavigation } from '../dataSourceNavigation.component';
import { defaultProps } from '../dataSourceNavigation.stories';
import { Button } from '../dataSourceNavigation.styles';
import {
  FILTERS_PAGE,
  PREVIEW_PAGE,
  RESULT_PAGE,
  SOURCE_PAGE,
  STEPS_PAGE,
  VIEWS_PAGE,
} from '../../../../modules/dataSource/dataSource.constants';

describe('DataSourceNavigation: Component', () => {
  const component = props => <DataSourceNavigation {...defaultProps} {...props} />;
  const pages = [SOURCE_PAGE, PREVIEW_PAGE, STEPS_PAGE, RESULT_PAGE, FILTERS_PAGE, VIEWS_PAGE];
  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  pages.forEach((page, index) => {
    it(`should go to ${page} page`, () => {
      jest.spyOn(defaultProps.history, 'push');
      const wrapper = render();
      wrapper
        .find(Button)
        .at(index)
        .simulate('click');

      expect(defaultProps.history.push).toHaveBeenCalledWith(`/datasource/1/${page}`);
    });
  });
});