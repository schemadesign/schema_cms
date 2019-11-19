import { defaultTheme } from '../../../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    color: theme.radioButton.text,
  },
  inputStyles: {
    visibility: 'hidden',
    position: 'absolute',
    overflow: 'hidden',
    height: 0,
    top: 0,
    left: 0,
  },
  labelStyles: {
    cursor: 'pointer',
  },
});
