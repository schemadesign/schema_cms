import { defaultTheme } from '../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    border: 'none',
    backgroundColor: theme.button.background,
    fill: theme.icon.fill,
    color: theme.button.text,
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
