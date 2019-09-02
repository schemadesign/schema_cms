export const HEADER_COLOR = '#1D1D20';
export const TEXT_COLOR = '#71737e';

export const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};

export const columnStyles = {
  columnItem: {
    backgroundColor: HEADER_COLOR,
    color: TEXT_COLOR,
    border: '1px solid #fff',
    padding: '10px 15px',
  },
  columnHeader: {
    display: 'flex',
  },
};

export const rowStyles = {
  rowItem: {
    padding: '10px 15px',
  },
  rowHeader: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  },
};
