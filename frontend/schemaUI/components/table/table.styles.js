import { defaultTheme } from '../../utils/theme';

export const getStyles = (theme = defaultTheme) => {
  const { background, border, text } = theme.table;

  const cell = {
    padding: '7px 12px',
    borderBottom: `2px solid ${border.body}`,
    borderRight: `2px solid ${border.body}`,
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'pre',
  };

  const headerCell = {
    ...cell,
    padding: '12px',
    borderRightColor: border.header,
    borderBottomColor: border.header,
  };

  const thead = {
    color: text.header,
    backgroundColor: background.header,
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
      color: text.body,
    },
    thead,
    lastRow: {
      borderBottomColor: border.body,
      paddingBottom: '10px',
    },
    cell,
    cellCustom: {
      ...cell,
      border: `2px solid ${border.body}`,
    },
    headerCell,
    headerFirstCell: {
      ...headerCell,
      textAlign: 'center',
    },
    headerLastCell: {
      ...headerCell,
      borderRightColor: border.body,
    },
    headerLeftCell,
    headerLastLeftCell: {
      ...headerLeftCell,
      borderBottomColor: background.header,
    },
  };
};

export const headerBaseWidth = 40;
export const headerNarrowWidth = 25;
