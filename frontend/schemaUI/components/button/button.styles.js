import { defaultTheme } from '../../utils/theme';

export const getStyles = (theme = defaultTheme, buttonType = 'button') => ({
  containerStyles: {
    border: 'none',
    backgroundColor: theme[buttonType].background,
    fill: theme.icon.fill,
    color: theme[buttonType].text,
    padding: '0',
    margin: '0',
    outline: 'none',
    cursor: 'pointer',
    borderRadius: '48px',
    minHeight: '48px',
    fontSize: '18px',
    display: 'inline-block',
  },
});
