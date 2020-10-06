import styled, { css } from 'styled-components';
import { Typography } from 'schemaUI';
import { fonts, colors } from './styled';

const { Span: SpanUI } = Typography;

export const H1 = styled.h1`
  font-family: ${fonts.arial};
  font-weight: bold;
  color: ${colors.black};
`;

export const H2 = styled.h2`
  font-family: ${fonts.arial};
  font-weight: bold;
  color: ${colors.black};
`;

export const linkStyles = css`
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  transition: border 400ms;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.text};
  }
`;

export const PageLink = styled.a`
  text-decoration: none;
  white-space: nowrap;
  ${linkStyles};
`;

export const Link = styled(SpanUI)`
  ${linkStyles};
`;

export const LinkContainer = styled.div`
  border-top: 2px solid ${({ theme }) => theme.label.border};
  padding-top: 35px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
