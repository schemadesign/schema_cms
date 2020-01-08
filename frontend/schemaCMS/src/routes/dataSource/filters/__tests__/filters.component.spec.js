import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { Filters } from '../filters.component';
import { defaultProps } from '../filters.stories';
import { NextButton } from '../../../../shared/components/navigation';

describe('Filters: Component', () => {
  const component = props => <Filters {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchFilters = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      fetchFilters,
    });

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchFilters on componentDidMount', () => {
    const fetchFilters = jest.spyOn(defaultProps, 'fetchFilters');

    render({
      fetchFilters,
    });

    global.expect(fetchFilters).toHaveBeenCalledTimes(1);
  });

  it('should call fetchFilters on componentDidMount', async () => {
    const fetchFilters = jest.fn().mockReturnValue(Promise.resolve());
    const setFilters = jest.spyOn(defaultProps, 'setFilters').mockImplementation(() => {
      global.expect(setFilters).toHaveBeenCalledTimes(1);
    });

    const wrapper = await render({
      fetchFilters,
      setFilters,
    });

    await wrapper
      .find(Formik)
      .dive()
      .find(NextButton)
      .at(0)
      .simulate('click');
  });
});
