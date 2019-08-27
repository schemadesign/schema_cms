import { primary } from '../../utils/theme';

export const containerStyles = {
  fontFamily: primary.typography.span.fontFamily,
  borderTop: `2px solid ${primary.border}`,
  backgroundColor: primary.background,
  color: primary.text,
  padding: '12px 14px 14px',
  display: 'flex',
  flexDirection: 'column',
};

export const headerStyles = {
  marginBottom: '14px',
  color: primary.label,
  fontSize: '12px',
};
