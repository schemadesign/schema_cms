import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  defaultStyles: {
    border: 'none',
    outline: 'none',
    color: theme.textArea.text,
    fontSize: '18px',
    lineHeight: '24px',
    resize: 'none',
    padding: '0',
  },
  shadowStyles: {
    visibility: 'hidden',
    position: 'absolute',
    overflow: 'hidden',
    height: 0,
    top: 0,
    left: 0,
  },
});
