import React from 'react';

import { StateFilter } from '../stateFilter.component';
import { defaultProps } from '../stateFilter.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';
import { FILTER_TYPE_SELECT } from '../../../../modules/filter/filter.constants';
import { selectFilter, checkboxFilter, rangeFilter } from '../../../../modules/filter/filter.mocks';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({
    filterId: '1',
  }),
}));

describe('StateFilter: Component', () => {
  const render = props => makeContextRenderer(<StateFilter {...defaultProps} {...props} />);

  it('should render input filter', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render select filter', async () => {
    const wrapper = await render({ filter: selectFilter });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render checkbox filter', async () => {
    const wrapper = await render({ filter: checkboxFilter });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render range filter', async () => {
    const wrapper = await render({ filter: rangeFilter, fieldsInfo: [0, 10] });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should fetch filter', async () => {
    jest.spyOn(defaultProps, 'fetchFilter');
    jest.spyOn(defaultProps, 'fetchFieldsInfo');
    await render();
    expect(defaultProps.fetchFilter).toHaveBeenCalledWith({ filterId: 1 });
    expect(defaultProps.fetchFieldsInfo).not.toHaveBeenCalled();
  });

  it('should fetch fields info', async () => {
    const fetchFilter = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ filterType: FILTER_TYPE_SELECT, field: 'field', datasource: { id: 'dataSourceId' } })
      );
    jest.spyOn(defaultProps, 'fetchFieldsInfo');
    await render({ fetchFilter });
    expect(defaultProps.fetchFieldsInfo).toHaveBeenCalledWith({ field: 'field', dataSourceId: 'dataSourceId' });
  });
});
