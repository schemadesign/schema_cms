import { defaultTheme } from '../../../utils/theme';

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
    cursor: 'pointer',
    width: '100%',
  },
  selectedOptionStyles: {
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  optionListStyles: menuOpen => ({
    display: menuOpen ? 'block' : 'none',
    maxHeight: '184px',
    overflowY: menuOpen ? 'auto' : 'hidden',
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    top: 'calc(100% + 5px)',
    left: '0',
    zIndex: 99,
    backgroundColor: theme.select.background,
    WebkitOverflowScrolling: 'touch',
  }),
  hoverStyles: {
    backgroundColor: theme.text,
    color: theme.background,
  },
});
