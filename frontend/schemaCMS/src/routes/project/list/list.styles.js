import styled from 'styled-components';
import { Container as DefaultContainer } from '../../../shared/components/styledComponents/container';

export const Container = styled(DefaultContainer)``;

export const ProjectsList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const ProjectItem = styled.li`
  margin-top: 25px;

  &:first-child {
    margin-top: 0;
  }
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

  &::before {
    content: '•';
    margin-left: -1.5em;
    display: inline-block;
    padding: 0 7px;
  }
`;

export const Description = styled.div`
  margin: 7px 0 14px;
  cursor: pointer;
`;

export const urlStyles = {
  fontSize: '12px',
  whiteSpace: 'nowrap',
  display: 'block',
  width: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

export const titleStyles = {
  cursor: 'pointer',
};
