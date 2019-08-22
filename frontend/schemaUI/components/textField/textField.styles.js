import { primary } from '../../utils/theme';

export const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  padding: '5px 0 30px',
  position: 'relative',
};

export const defaultInputStyles = {
  border: 'none',
  outline: 'none',
  color: primary.text,
  fontSize: '18px',
  lineHeight: '24px',
};

export const defaultLabelStyles = {
  color: primary.label,
  fontSize: '18px',
  lineHeight: '24px',
};

export const errorStyles = {
  color: primary.error,
};

export const iconContainerStyles = {
  position: 'absolute',
  right: 0,
  top: 0,
};
