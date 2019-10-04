import styled from 'styled-components';
import { Typography, Button } from 'schemaUI';

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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10000,
  },
  content: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: '1px solid #ccc',
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
`;
