import { primary } from '../../utils/theme';

const containerStyles = {
  backgroundColor: primary.background,
  color: primary.text,
  position: 'fixed',
  top: 0,
  right: 0,
  width: '100%',
  maxWidth: '360px',
  minHeight: '100vh',
  padding: '18px 20px 27px',
  transition: 'transform 400ms cubic-bezier(0.86, 0, 0.07, 1), visibility 0s linear 400ms',
  textAlign: 'left',
};

const closeButtonStyles = {
  position: 'absolute',
  top: '6px',
  right: 0,
};

const showStyles = {
  visibility: 1,
};

const hideStyles = {
  visibility: 0,
  transform: 'translateX(100%)',
};

export { containerStyles, closeButtonStyles, showStyles, hideStyles };
