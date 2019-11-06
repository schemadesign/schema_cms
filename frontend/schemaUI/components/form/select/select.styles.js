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
    display: 'flex',
    cursor: 'pointer',
    padding: `${PADDING}px`,
    borderTop: index ? `1px solid  ${theme.select.border}` : 'none',
  }),
  selectedOptionsStyles: {
    display: 'flex',
    height: `${ITEM_HEIGHT}px`,
    cursor: 'pointer',
    width: '100%',
  },
  selectedOptionStyles: {
    display: 'flex',
    cursor: 'pointer',
    height: `${ITEM_HEIGHT}px`,
    alignItems: 'center',
  },
  optionListStyles: menuOpen => ({
    display: menuOpen ? 'flex' : 'none',
    maxHeight: '175px',
    overflow: menuOpen ? 'auto' : 'hidden',
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    top: `${ITEM_HEIGHT + PADDING * 2 + 2}px`,
    left: '0',
    zIndex: 2,
    backgroundColor: theme.select.background,
  }),
});
