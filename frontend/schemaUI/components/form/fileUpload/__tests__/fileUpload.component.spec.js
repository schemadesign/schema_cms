import React from 'react';
import { shallow } from 'enzyme';

import { FileUpload } from '../fileUpload.component';

describe('FileUpload: Component', () => {
  const defaultProps = {
    id: 'id',
  };
  const component = props => <FileUpload {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with label', () => {
    const props = {
      id: 'id',
      label: 'label',
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with file name', () => {
    const props = {
      id: 'id',
      label: 'label',
      name: 'name.csv',
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom icon', () => {
    const props = {
      id: 'id',
      label: 'label',
      iconComponent: <span>icon</span>,
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const props = {
      id: 'id',
      label: 'label',
      customStyles: {
        backgroundColor: 'red',
      },
      customLabelStyles: {
        backgroundColor: 'blue',
      },
      customInputStyles: {
        backgroundColor: 'green',
      },
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
