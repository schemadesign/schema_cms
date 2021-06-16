import styled, { css } from 'styled-components';
import { colors } from '../../../theme/styled';

export const Container = styled.div`
  margin-top: 60px;
  margin-bottom: 140px;
`;

export const FieldTypeHeader = styled.div`
  border-bottom: 1px solid ${colors.coolGray};
  margin-bottom: 30px;
`;

export const FieldType = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

export const FieldName = styled.div`
  display: flex;
  flex: 1;
  text-transform: capitalize;
`;

export const customSelectStyles = css`
  width: 100%;
  align-items: center;
`;
