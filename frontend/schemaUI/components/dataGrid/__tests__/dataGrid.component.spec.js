import React from 'react';
import { shallow } from 'enzyme';

import { DataGrid } from '../dataGrid.component';
import { BLACK_COLOR, BLUE_COLOR, WHITE_COLOR, GRAY_COLOR } from '../dataGrid.styles';

describe('DataGrid: Component', () => {
  const data = {
    columns: [
      { name: 'id', displayName: '#' },
      { name: 'name', displayName: 'Name' },
      { name: 'surname', displayName: 'Surname' },
      { name: 'dateOfBirth', displayName: 'Date of Birth' },
    ],
    rows: [
      { id: '342', name: 'Alan', surname: 'Watts', dateOfBirth: '06/01/1915' },
      { id: '355', name: 'David', surname: 'Bowie', dateOfBirth: '08/01/1947' },
      { id: '123', name: 'Dale', surname: 'Chihuly', dateOfBirth: '20/09/1941' },
      { id: '556', name: 'Sebastião', surname: 'Salgado', dateOfBirth: '08/02/1944' },
    ],
  };

  const defaultProps = {
    data,
  };

  const component = props => <DataGrid {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles and size', () => {
    const columnAlternativeStyles = {
      backgroundColor: BLUE_COLOR,
      border: `0.3px solid ${WHITE_COLOR}`,
      padding: '10px 5px',
      color: WHITE_COLOR,
    };

    const rowAlternativeStyles = {
      id: {
        backgroundColor: BLUE_COLOR,
        border: `0.3px solid ${WHITE_COLOR}`,
        padding: '10px 5px',
        color: WHITE_COLOR,
      },
      name: {
        backgroundColor: BLACK_COLOR,
        border: `0.3px solid ${WHITE_COLOR}`,
        padding: '10px 5px',
        color: GRAY_COLOR,
      },
      surname: {
        backgroundColor: BLACK_COLOR,
        border: `0.3px solid ${WHITE_COLOR}`,
        padding: '10px 5px',
        color: GRAY_COLOR,
      },
      dateOfBirth: {
        backgroundColor: BLACK_COLOR,
        border: `0.3px solid ${WHITE_COLOR}`,
        padding: '10px 5px',
        color: GRAY_COLOR,
      },
    };

    const dataWithStylesAndSize = {
      columns: [
        { name: 'id', displayName: '# - Sized', styles: columnAlternativeStyles, size: 10 },
        { name: 'name', displayName: 'Name', styles: columnAlternativeStyles },
        { name: 'surname', displayName: 'Surname', styles: columnAlternativeStyles },
        { name: 'dateOfBirth', displayName: 'Date of Birth', styles: columnAlternativeStyles },
      ],
      rows: [
        { id: '342', name: 'Alan', surname: 'Watts', dateOfBirth: '06/01/1915', styles: rowAlternativeStyles },
        { id: '355', name: 'David', surname: 'Bowie', dateOfBirth: '08/01/1947', styles: rowAlternativeStyles },
        { id: '123', name: 'Dale', surname: 'Chihuly', dateOfBirth: '20/09/1941', styles: rowAlternativeStyles },
        { id: '556', name: 'Sebastião', surname: 'Salgado', dateOfBirth: '08/02/1944', styles: rowAlternativeStyles },
      ],
    };

    const wrapper = render({ data: dataWithStylesAndSize });
    global.expect(wrapper).toMatchSnapshot();
  });
});
