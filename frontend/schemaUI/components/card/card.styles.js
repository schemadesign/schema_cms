import { light } from '../../utils/theme';

export const getStyles = (theme = light) => ({
  headerStyles: {
    marginBottom: '14px',
    color: theme.card.label,
    fontSize: '12px',
  },
  containerStyles: {
    fontFamily: theme.typography.span.fontFamily,
    borderTop: `2px solid ${theme.card.border}`,
    backgroundColor: theme.card.background,
    color: theme.text,
    padding: '12px 14px 14px',
    display: 'flex',
    flexDirection: 'column',
  },
});
