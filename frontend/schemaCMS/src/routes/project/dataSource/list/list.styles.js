import styled, { css } from 'styled-components';
import { Theme } from 'schemaUI';
import { styleWhenTrue } from '../../../../shared/utils/rendering';

export const Container = styled.div`
  margin: 0 20px 60px 20px;
`;

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
  margin-top: 24px;
`;

export const titleStyles = {
  cursor: 'pointer',
  marginBottom: '20px',
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

export const MetaDataName = styled.span`
  color: ${Theme.primary.label};
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 10px;
`;

const lockStyles = styleWhenTrue(
  ({ isLock }) => isLock,
  css`
    color: ${Theme.primary.label};
  `
);

export const MetaDataValue = styled.span`
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;

  ${lockStyles}
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const HeaderIcon = styled.div`
  margin-top: -8px;
`;

export const lockTextStyles = {
  color: Theme.primary.label,
};

export const addDataSourceStyles = {
  position: 'fixed',
  right: '10px',
  bottom: '10px',
  backgroundColor: Theme.primary.label,
  height: '60px',
};

export const iconSourceStyles = {
  width: 40,
  height: 40,
  fill: Theme.primary.iconDark,
};

export const lockIconStyles = {
  fill: Theme.primary.label,
};
