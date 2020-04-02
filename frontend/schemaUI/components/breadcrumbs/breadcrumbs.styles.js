import { defaultTheme } from '../../utils/theme';

export const containerStyles = {
  display: 'flex',
};

export const getStyles = (theme = defaultTheme) => ({
  separatorStyles: {
    color: theme.breadcrumbs.separator,
    marginLeft: '10px',
  },
  itemStyles: {
    color: theme.breadcrumbs.link,
    display: 'flex',
    marginRight: '10px',
  },
});
