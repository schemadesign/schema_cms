import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const Label = styled.div`
  color: #b7b7b7;
`;

export const Value = styled.div``;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  margin: 10px 0;
`;

export const Form = styled.form``;

export const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const linkStyles = css`
  color: ${({ theme }) => theme.text};
  padding: 10px 0;
  transition: color 200ms ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.secondaryText};
  }
`;

export const Download = styled.a`
  ${linkStyles};
`;

export const PreviewLink = styled(Link)`
  ${linkStyles};
`;
