import { defaultTheme } from '../../utils/theme';
import { BUTTON } from './button.constants';

export const getStyles = (theme = defaultTheme, buttonType = BUTTON, disabled) => ({
  containerStyles: {
    border: 'none',
    backgroundColor: theme[buttonType].background,
    fill: theme.icon.fill,
    color: theme[buttonType].text,
    padding: '0',
    margin: '0',
    outline: 'none',
    cursor: disabled ? 'default' : 'pointer',
    borderRadius: '48px',
    minHeight: '48px',
    fontSize: '18px',
    display: 'inline-block',
    transition: 'background 0.25s ease-in-out, color 0.25s ease-in-out',
  },
});
