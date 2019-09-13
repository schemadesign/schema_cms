import { primary } from '../../../utils/theme';

export const containerStyles = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 48,
  borderBottom: `1px solid ${primary.divider}`,
};

export const iconContainerStyles = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

export const inputStyles = {
  visibility: 'hidden',
  position: 'absolute',
  overflow: 'hidden',
  height: 0,
  top: 0,
  left: 0,
};
