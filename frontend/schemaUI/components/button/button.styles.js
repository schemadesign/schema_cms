import { defaultTheme } from '../../utils/theme';
import { BUTTON, BUTTON_SIZES } from './button.constants';

const sizes = {
  [BUTTON_SIZES.BIG]: {
    borderRadius: '30px',
    padding: '0',
    minHeight: '48px',
    fontSize: '20px',
  },
  [BUTTON_SIZES.MEDIUM]: {
    borderRadius: '4px',
    padding: '0 8px 0 6px',
    minHeight: '32px',
    fontSize: '14px',
  },
  [BUTTON_SIZES.SMALL]: {
    borderRadius: '30px',
    padding: '0 16px',
    minHeight: '30px',
    fontSize: '14px',
  },
};

export const getStyles = (theme = defaultTheme, buttonType = BUTTON, disabled, size) => ({
  containerStyles: {
    border: 'none',
    borderRadius: sizes[size].borderRadius,
    backgroundColor: theme[buttonType].background,
    fill: theme.icon.fill,
    color: theme[buttonType].text,
    padding: sizes[size].padding,
    margin: '0',
    outline: 'none',
    cursor: disabled ? 'default' : 'pointer',
    minHeight: sizes[size].minHeight,
    fontSize: sizes[size].fontSize,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background 0.25s ease-in-out, color 0.25s ease-in-out',
  },
});
