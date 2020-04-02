import { defaultTheme } from '../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    color: theme.link.text,
    textDecoration: 'none',
  },
});
