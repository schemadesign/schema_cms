import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';
import { identity } from 'ramda';

import { View } from '../view.component';

describe('View: Component', () => {
  const defaultProps = {
    fetchOne: identity,
    project: {},
    history: {},
  };

  const component = props => <View {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchOne prop on componentDidMount', async () => {
    const id = '1';
    const fetchOne = spy();
    const props = {
      ...defaultProps,
      fetchOne,
      match: {
        params: {
          id,
        },
      },
    };

    await render(props);

    expect(fetchOne).to.have.been.calledWith(id);
  });
});
