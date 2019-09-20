import { light } from '../../utils/theme';

export const containerStyles = {
  fontFamily: light.typography.span.fontFamily,
  borderTop: `2px solid ${light.border}`,
  backgroundColor: light.background,
  color: light.text,
  padding: '12px 14px 14px',
  display: 'flex',
  flexDirection: 'column',
};

export const headerStyles = {
  marginBottom: '14px',
  color: light.label,
  fontSize: '12px',
};
