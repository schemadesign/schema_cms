import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

import { media } from '../../../theme/media';

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

export const StepCounter = styled.div`
  width: 60%;
  text-align: center;
  color: ${({ theme: { secondaryText } }) => secondaryText};
`;

export const Empty = styled.div`
  width: 20%;
`;

export const UploadContainer = styled.div`
  width: 20%;
  text-align: right;
`;

export const Error = styled.div`
  color: ${({ theme: { error } }) => error};
`;

export const Warning = styled.div`
  color: ${({ theme: { warning } }) => warning};
`;

export const Link = styled(RouterLink)`
  color: inherit;
  text-decoration: none;
  width: 100%;
`;

export const Dot = styled.div`
  display: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin: 0 10px 2px 10px;
  background-color: ${({ theme: { secondaryText } }) => secondaryText};

  ${media.tablet`
    display: inline-block;
  `};
`;

export const Type = styled.div`
  color: ${({ theme: { secondaryText } }) => secondaryText};
  width: 100%;

  ${media.tablet`
    width: auto;
    display: inline;
  `};
`;

export const StepName = styled.div`
  overflow: hidden;
  width: ${({ drag }) => (drag ? 'calc(100% - 28px)' : '100%')};
  text-overflow: ellipsis;
  white-space: nowrap;

  ${media.tablet`
    width: auto;
    display: inline;
  `};
`;

export const CheckboxContent = styled.div`
  display: flex;
  align-items: center;
`;

export const IconWrapper = styled.div`
  display: flex;
  cursor: move;
  touch-action: none;
`;

export const checkBoxStyles = {
  width: '100%',
};

export const checkBoxContainerStyles = {
  borderTop: 'none',
};

export const menuIconStyles = { width: 10, marginRight: 20 };

export const selectedLabelStyles = { marginBottom: 20 };
export const labelStyles = { margin: '40px 0 20px 0' };
