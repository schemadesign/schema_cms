import styled from 'styled-components';
import { Button as ButtonUI } from 'schemaUI';
import { colors } from '../../../theme/styled';

export const Container = styled.div``;

export const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  padding: 10px 0;
  color: ${colors.grey};
  border-top: 1px solid ${colors.grey};
`;

export const AddIcon = styled.div`
  position: relative;
  height: 15px;
  width: 15px;
  &:before {
    content: '';
    position: absolute;
    height: 15px;
    width: 2px;
    background-color: ${colors.grey};
    left: 50%;
    transform: translateX(-50%);
    top: 0;
  }

  &:after {
    content: '';
    position: absolute;
    height: 2px;
    width: 15px;
    background-color: ${colors.grey};
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }

  transform: rotate(90deg);
`;

export const RemoveIcon = styled.div`
  position: relative;
  height: 15px;
  width: 15px;
  &:after {
    content: '';
    position: absolute;
    height: 2px;
    width: 15px;
    background-color: ${colors.grey};
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }
`;

export const Button = styled(ButtonUI)`
  background-color: transparent !important;
`;
