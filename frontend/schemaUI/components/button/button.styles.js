import { light } from '../../utils/theme';

export const getStyles = (theme = light) => ({
  containerStyles: {
    border: 'none',
    backgroundColor: theme.background,
    color: theme.text,
    padding: '0',
    margin: '0',
    outline: 'none',
    cursor: 'pointer',
    borderRadius: '48px',
    minHeight: '48px',
    fontSize: '18px',
    display: 'inline-block',
  },
});
