import React from 'react';
import { shallow } from 'enzyme';

import { Source } from '../source.component';
import { defaultProps } from '../source.stories';
import { Form, Link } from '../source.styles';
import browserHistory from '../../../../shared/utils/history';

describe('SourceComponent: Component', () => {
  const component = props => <Source {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render file uploader', () => {
    const props = {
      dataSource: {
        type: 'file',
        project: { id: 'projectId' },
      },
    };
    const wrapper = render(props);

    expect(wrapper).toMatchSnapshot();
  });

  it('should call handleSubmit', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });

  it('should call handleSubmit and set runLastJob on true', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');
    wrapper.find('#confirmRunLastJob').simulate('click');

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('runLastJob', true);
  });

  it('should call handleSubmit and set runLastJob on false', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');
    wrapper.find('#declineRunLastJob').simulate('click');

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('runLastJob', false);
  });

  it('should remove data source', () => {
    jest.spyOn(defaultProps, 'removeDataSource');

    const wrapper = render();
    wrapper
      .find(Form)
      .dive()
      .find('#removeDataSourceDesktopBtn')
      .simulate('click');
    wrapper.find('#confirmRemoveDataSource').simulate('click');

    expect(defaultProps.removeDataSource).toHaveBeenCalledWith({
      dataSourceId: 'dataSourceIdId',
      projectId: 'projectId',
    });
  });

  it('should redurect on click past versions', () => {
    jest.spyOn(browserHistory, 'push');

    const wrapper = render();
    wrapper
      .find(Form)
      .dive()
      .find(Link)
      .at(0)
      .simulate('click');

    expect(browserHistory.push).toHaveBeenCalledWith('/datasource/1/job');
  });
});
