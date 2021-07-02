import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from '../../../theme/media';

export const Container = styled.div``;

export const ProjectsList = styled.ul`
  list-style: none;
  padding: 0;

  ${media.desktop`
    display: flex;
    flex-wrap: wrap;
    margin-left: -20px;
  `};
`;

export const ProjectItem = styled.li`
  margin-top: 25px;
  width: 100%;

  &:first-child {
    margin-top: 0;
  }

  ${media.desktop`
    flex: 0 0 auto;
    width: calc(33% - 16.66px);
    margin: 0 0 20px 20px;
  `};
`;

export const HeaderList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

export const HeaderItem = styled.li`
  display: inline-block;
  line-height: 1.25;
  margin-right: 1.5em;
  color: ${({ theme: { label } }) => label.text};

  &::before {
    content: '•';
    margin-left: -1.5em;
    display: inline-block;
    padding: 0 7px;
  }
`;

export const Description = styled(Link)`
  margin: 7px 0 14px;
  cursor: pointer;
  white-space: pre-wrap;
  word-break: break-word;
  display: inline-block;
  color: ${({ theme: { card } }) => card.text};
  font-size: 18px;
  line-height: 1.33em;
  font-weight: 300;
  text-decoration: none;
`;

export const Footer = styled.div`
  color: ${({ theme: { card } }) => card.text};
  font-size: 12px;
  font-weight: 300;
  white-space: nowrap;
  display: block;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;
