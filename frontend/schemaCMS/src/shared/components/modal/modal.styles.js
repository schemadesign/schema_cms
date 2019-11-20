import styled from 'styled-components';
import { Typography } from 'schemaUI';
import ReactModal from 'react-modal';

import { media } from '../../../theme/media';

const { H1 } = Typography;

export const Modal = styled(ReactModal)`
  background-color: ${({ theme }) => theme.background};
  padding: 50px 20px;

  ${media.tablet`
    padding: 50px;
  `};
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
    top: '50%',
    left: '50%',
    right: '10px',
    transform: 'translate(-50%, -50%)',
    width: 'calc(100% - 20px)',
    maxWidth: '600px',
    border: null,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.5)',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export const ModalTitle = styled(H1)`
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

export const ModalActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;
