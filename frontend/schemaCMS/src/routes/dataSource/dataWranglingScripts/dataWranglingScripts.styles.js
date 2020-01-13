import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const CHECKBOX_HEIGHT = 48;
export const ANIMATION_SPEED = 200;
export const ANIMATION_DELAY = 100;

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
`;

export const Dot = styled.div`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin: 0 10px 2px 10px;
  background-color: ${({ theme: { secondaryText } }) => secondaryText};
`;

export const Type = styled.span`
  color: ${({ theme: { secondaryText } }) => secondaryText};
`;

export const CheckboxContent = styled.div`
  display: flex;
  align-items: center;
`;

export const IconWrapper = styled.div`
  display: flex;
  cursor: move;
`;

export const CheckBoxStyles = {
  width: '100%',
  maxHeight: `${CHECKBOX_HEIGHT}px`,
  overflow: 'hidden',
  transition: `opacity ${ANIMATION_SPEED}ms linear, max-height ${ANIMATION_SPEED}ms linear`,
};
