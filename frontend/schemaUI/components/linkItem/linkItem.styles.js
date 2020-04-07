import { defaultTheme } from '../../utils/theme';

export const containerStyles = {
  border: '1px solid blue',
};

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
  },
});
