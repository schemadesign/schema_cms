import { defaultTheme } from '../../utils/theme';
import { BUTTON, BUTTON_SIZES } from './button.constants';

const sizes = {
  [BUTTON_SIZES.BIG]: {
    padding: '0',
    minHeight: '48px',
    fontSize: '20px',
  },
  [BUTTON_SIZES.SMALL]: {
    padding: '0 16px',
    minHeight: '30px',
    fontSize: '14px',
  },
};

export const getStyles = (theme = defaultTheme, buttonType = BUTTON, disabled, size) => ({
  containerStyles: {
    border: 'none',
    backgroundColor: theme[buttonType].background,
    fill: theme.icon.fill,
    color: theme[buttonType].text,
    padding: sizes[size].padding,
    margin: '0',
    outline: 'none',
    cursor: disabled ? 'default' : 'pointer',
    borderRadius: '30px',
    minHeight: sizes[size].minHeight,
    fontSize: sizes[size].fontSize,
    display: 'inline-block',
    transition: 'background 0.25s ease-in-out, color 0.25s ease-in-out',
  },
});
