import React from 'react';
import { shallow } from 'enzyme';

import { Table } from '../table.component';
import { tableWithNumberedRows } from '../table.stories';

describe('Table: Component', () => {
  const component = props => <Table {...tableWithNumberedRows} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
