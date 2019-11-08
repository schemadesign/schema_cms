import styled from 'styled-components';
import { Typography, Button } from 'schemaUI';
import { media, isDesktop as isDesktopFn } from '../../../theme/media';

const { H1 } = Typography;

export const ModalButton = styled(Button)`
  width: 100px;
`;

export const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(29, 29, 32, 0.75)',
    zIndex: 10000,
  },
  content: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: null,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.5)',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: 'FFFFFF',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
  },
};

export const ModalTitle = styled(H1)`
  color: #ffffff;
`;

export const ModalActions = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px;

  ${media.desktop`
    margin-top: 30px;
    position: static;
  `}
`;

export const getModalStyles = () => {
  const isDesktop = isDesktopFn();

  if (!isDesktop) {
    return modalStyles;
  }

  return {
    overlay: {
      ...modalStyles.overlay,
    },
    content: {
      ...modalStyles.content,
      top: '80px',
      left: '50%',
      right: null,
      bottom: null,
      transform: 'translateX(-50%)',
      padding: '50px',
      flexDirection: 'column',
    },
  };
};
