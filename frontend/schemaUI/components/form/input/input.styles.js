import { defaultTheme } from '../../../utils/theme';

export const MIN_WIDTH = 60;

export const getStyles = (theme = defaultTheme) => ({
  defaultStyles: {
    border: 'none',
    outline: 'none',
    color: theme.input.text,
    fontSize: '18px',
    lineHeight: '24px',
    backgroundColor: 'transparent',
    padding: 0,
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    minWidth: MIN_WIDTH,
    maxWidth: '100%',
    letterSpacing: 'normal',
  },
  hiddenStyles: {
    opacity: 0,
    visibility: 'hidden',
    position: 'fixed',
    whiteSpace: 'pre',
  },
});
