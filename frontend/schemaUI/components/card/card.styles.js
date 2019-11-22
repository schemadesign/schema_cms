import { defaultTheme } from '../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  headerStyles: {
    color: theme.card.label,
    marginBottom: 14,
  },
  footerStyles: {
    color: theme.label.text,
    marginBottom: 4,
  },
  containerStyles: {
    position: 'relative',
    fontSize: '12px',
    fontFamily: theme.typography.span.fontFamily,
    borderTop: `2px solid ${theme.card.border}`,
    backgroundColor: theme.card.background,
    color: theme.text,
    padding: '12px 14px 14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
