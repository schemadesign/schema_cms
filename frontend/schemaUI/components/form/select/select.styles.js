import { defaultTheme } from '../../../utils/theme';

const ITEM_HEIGHT = 30;
const PADDING = 7;

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    display: 'flex',
    width: '100%',
    color: theme.text,
  },
  getSelectStyle: (hidden = false) => ({
    display: hidden ? 'none' : 'flex',
  }),
  selectWrapperStyles: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    cursor: 'pointer',
  },
  customOptionStyle: index => ({
    cursor: 'pointer',
    padding: '20px 10px',
    border: `1px solid  ${theme.select.border}`,
    borderTop: !index ? `1px solid  ${theme.select.border}` : 'none',
    color: theme.secondaryText,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  selectedOptionsStyles: {
    display: 'flex',
    height: `${ITEM_HEIGHT}px`,
    cursor: 'pointer',
    width: '100%',
  },
  selectedOptionStyles: {
    cursor: 'pointer',
    height: `${ITEM_HEIGHT}px`,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  optionListStyles: menuOpen => ({
    display: menuOpen ? 'block' : 'none',
    maxHeight: '183px',
    overflowY: menuOpen ? 'auto' : 'hidden',
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    top: `${ITEM_HEIGHT + PADDING}px`,
    left: '0',
    zIndex: 2,
    backgroundColor: theme.select.background,
  }),
  hoverStyles: {
    backgroundColor: theme.text,
    color: theme.background,
  },
});
