import styled from 'styled-components';
import { Theme } from 'schemaUI';

export const Container = styled.div`
  font-family: ${Theme.primary.typography.h3.fontFamily};
  font-weight: 600px;
  font-size: 14px;
`;

export const Content = styled.div`
  overflow: auto;
  max-height: calc(100vh - 70px);
  margin-top: 50px;
  margin-right: -20px;
  padding-right: 20px;
  -webkit-overflow-scrolling: touch;
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const PrimaryList = styled(List)`
  margin-bottom: 20px;
`;

export const SecondaryList = styled(List)``;

export const Item = styled.li`
  line-height: 1.5;
  margin: 2px 0;
  cursor: pointer;
`;

export const PrimaryItem = styled(Item)`
  font-size: 24px;
    border-bottom: 2.4px solid ${Theme.primary.background};
    padding: 8px 0 13px;

    &:first-of-type {
      border-top 2.4px solid ${Theme.primary.background};
    }
`;

export const SecondaryItem = styled(Item)`
  padding: 8px 0;
`;
