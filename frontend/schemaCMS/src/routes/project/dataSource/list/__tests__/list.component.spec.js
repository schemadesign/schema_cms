import React from 'react';
import { shallow } from 'enzyme';

import { List } from '../list.component';
import {
  STATUS_DRAFT,
  STATUS_ERROR,
  STATUS_PROCESSING,
  STATUS_READY_FOR_PROCESSING,
} from '../../../../../modules/dataSource/dataSource.constants';

describe('List: Component', () => {
  const defaultProps = {
    createDataSource: Function.prototype,
    fetchDataSources: Function.prototype,
    dataSources: [],
    history: {
      push: Function.prototype,
    },
    match: {
      params: {
        projectId: '1',
      },
    },
    intl: {
      formatMessage: ({ defaultMessage }) => defaultMessage,
    },
  };

  const dataSource = {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 17,
    metaData: {
      fields: 11,
      items: 246,
    },
    name: 'name',
    status: 'done',
  };

  const component = props => <List {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render empty', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const props = {
      dataSources: [dataSource],
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render card with error state', () => {
    dataSource.status = STATUS_ERROR;
    dataSource.errorLog = ['error 1', 'error2'];
    const props = {
      dataSources: [dataSource],
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render card with draft state', () => {
    dataSource.status = STATUS_DRAFT;
    const props = {
      dataSources: [dataSource],
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render card with processing state', () => {
    dataSource.status = STATUS_PROCESSING;
    const props = {
      dataSources: [dataSource],
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render card with ready for processing state', () => {
    dataSource.status = STATUS_READY_FOR_PROCESSING;
    const props = {
      dataSources: [dataSource],
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
