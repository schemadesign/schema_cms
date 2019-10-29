import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Form as FormUI } from 'schemaUI';

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

export const Step = styled.li`
  color: ${({ theme }) => theme.text};
`;

export const StepsTitle = styled(FormUI.Label)`
  color: ${({ theme }) => theme.secondaryText};
  margin-bottom: 10px;
`;

export const StepsWrapper = styled.ul`
  list-style-type: circle;
  padding-left: 20px;
  margin-bottom: 40px;
`;
