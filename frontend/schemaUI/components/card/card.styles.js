import {theme} from '../../utils/theme';

const {primary} = theme;

export const containerStyles = {
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