import { primary } from '../../utils/theme';

export const containerStyles = {
  display: 'flex',
  flexDirection: 'row',
};

export const dotStyles = {
  width: '12px',
  height: '12px',
  backgroundColor: primary.background,
  display: 'block',
  borderRadius: '50%',
  margin: '0 4px',
  cursor: 'pointer',
};

export const dotActiveStyles = {
  backgroundColor: primary.active,
  cursor: 'default',
  pointerEvents: 'none',
};
