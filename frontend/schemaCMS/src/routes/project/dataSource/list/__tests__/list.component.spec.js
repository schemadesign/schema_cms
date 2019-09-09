import React from 'react';
import { shallow } from 'enzyme';

import { List } from '../list.component';
import { STATUS_DRAFT, STATUS_ERROR, STATUS_PROCESSING } from '../../../../../modules/dataSource/dataSource.constants';

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
      formatMessage: Function.prototype,
    },
  };

  const dataSource = {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'Rafał', lastName: 'Gruszecki' },
    id: 17,
    metaData: {
      fields: 11,
      items: 246,
    },
    name: 'My New Data Source #bDxb',
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
});
