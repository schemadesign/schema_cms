import { defaultTheme } from '../../utils/theme';

export const getStyles = (theme = defaultTheme) => {
  const { table } = theme;

  const cell = {
    padding: '7px 12px',
    borderBottom: `2px solid ${table.border.body}`,
    borderRight: `2px solid ${table.border.body}`,
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'pre',
  };

  const headerCell = {
    ...cell,
    padding: '12px',
    borderRightColor: table.border.header,
    borderBottomColor: table.border.header,
  };

  const thead = {
    color: table.text.header,
    backgroundColor: table.background.header,
    fontWeight: 600,
  };

  const headerLeftCell = {
    ...headerCell,
    ...thead,
    textAlign: 'center',
  };

  return {
    tableWrapper: {
      width: '100%',
      overflowX: 'auto',
      paddingBottom: '10px',
    },
    table: {
      borderCollapse: 'collapse',
      minWidth: '100%',
      fontSize: '14px',
      color: table.text.body,
    },
    thead,
    lastRow: {
      borderBottomColor: table.border.body,
      paddingBottom: '10px',
    },
    cell,
    cellCustom: {
      ...cell,
      border: `2px solid ${table.border.body}`,
    },
    headerCell,
    headerFirstCell: {
      ...headerCell,
      textAlign: 'center',
    },
    headerLastCell: {
      ...headerCell,
      borderRightColor: table.border.body,
    },
    headerLeftCell,
    headerLastLeftCell: {
      ...headerLeftCell,
      borderBottomColor: table.background.header,
    },
  };
};

export const headerBaseWidth = 40;
export const headerNarrowWidth = 25;
