import { light } from '../../utils/theme';

export const HEADER_COLOR = '#1D1D20';
export const TEXT_COLOR = '#71737e';

export const BLUE_COLOR = '#778DA9';
export const BLACK_COLOR = '#3C474B';
export const WHITE_COLOR = '#fff';
export const GRAY_COLOR = '#E0E1DD';

export const getStyles = (theme = light) => ({
  containerStyles: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  columnStyles: {
    columnItem: {
      backgroundColor: theme.dataGrid.background,
      color: theme.dataGrid.text,
      border: '1px solid #fff',
      padding: '10px 15px',
    },
    columnHeader: {
      display: 'flex',
    },
  },
  rowStyles: {
    rowItem: {
      padding: '10px 15px',
    },
    rowHeader: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
    },
  },
});
