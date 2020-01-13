import React from 'react';
import { shallow } from 'enzyme';
import { Button, Table } from 'schemaUI';

import DataPreview from '../dataPreview.component';
import { defaultProps } from '../dataPreview.stories';
import { FieldDetail } from '../../fieldDetail';

describe('DataPreview: Component', () => {
  const component = props => <DataPreview {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchPreview = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = await render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchPreview on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchPreview');

    await render();

    expect(defaultProps.fetchPreview).toHaveBeenCalled();
  });

  it('should render field detail on click next', async () => {
    defaultProps.fetchPreview = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = await render();

    wrapper
      .find(Button)
      .at(1)
      .simulate('click');

    const detail = wrapper.find(FieldDetail);
    const table = wrapper.find(Table);

    expect(wrapper.state().step).toBe(1);
    expect(detail.length).toBe(1);
    expect(table.length).toBe(0);
  });

  it('should render previous page on click previous', async () => {
    defaultProps.fetchPreview = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = await render();

    wrapper.setState({ step: 1 });

    wrapper
      .find(Button)
      .at(0)
      .simulate('click');

    const detail = wrapper.find(FieldDetail);
    const table = wrapper.find(Table);

    expect(wrapper.state().step).toBe(0);
    expect(detail.length).toBe(0);
    expect(table.length).toBe(1);
  });
});
