import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    border: `2px dashed ${theme.border}`,
    width: 500,
    height: 50,
    display: 'block',
    cursor: 'copy',
    textAlign: 'center',
    borderRadius: 10,
    lineHeight: '50px',
  },
  hiddenStyles: {
    position: 'absolute',
    display: 'none',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
