import { defaultTheme } from '../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    transition: 'height 200ms ease-in-out, opacity 200ms ease-in-out',
    marginBottom: 10,
    opacity: 0,
    backgroundColor: theme.background,
  },
  hiddenStyles: {
    visibility: 'hidden',
    opacity: 0,
    position: 'absolute',
  },
});
