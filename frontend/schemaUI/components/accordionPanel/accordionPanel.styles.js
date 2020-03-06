import { defaultTheme } from '../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    borderTop: `2px solid ${theme.text}`,
    width: '100%',
    position: 'relative',
  },
});
