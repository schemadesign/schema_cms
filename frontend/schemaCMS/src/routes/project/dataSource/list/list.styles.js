import styled from 'styled-components';
import { Theme } from 'schemaUI';

export const Container = styled.div`
  margin: 0 20px 60px 20px;
`;

export const addDataSourceStyles = {
  position: 'fixed',
  right: '10px',
  bottom: '10px',
  backgroundColor: Theme.primary.label,
  height: '60px',
};

export const DataSourceItem = styled.li`
  margin-top: 10px;

  &:first-child {
    margin-top: 0;
  }
`;

export const Description = styled.div`
  margin: 7px 0 14px;
  cursor: pointer;
`;

export const DataSourceList = styled.div`
  list-style: none;
  padding: 0;
`;

export const titleStyles = {
  cursor: 'pointer',
};

export const MetaDataWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const MetaData = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MetaDataName = styled.span``;
export const MetaDataValue = styled.span``;
