import { defaultTheme } from '../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    display: 'flex',
  },
  separatorStyles: {
    color: theme.breadcrumbs.separator,
    marginLeft: '14px',
  },
  itemStyles: {
    color: theme.breadcrumbs.link,
    display: 'flex',
    marginRight: '14px',
    alignItems: 'flex-end',
  },
});
