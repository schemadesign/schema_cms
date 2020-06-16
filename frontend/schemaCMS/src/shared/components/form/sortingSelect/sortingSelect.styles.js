import styled from 'styled-components';
import { ASCENDING } from '../../../utils/helpers';

export const Container = styled.div`
  width: 200px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SelectWrapper = styled.div`
  width: 100%;
`;

export const getCarestStyles = ({ direction, disabled }) => ({
  cursor: disabled ? 'default' : 'pointer',
  pointerEvents: disabled ? 'none' : 'auto',
  opacity: disabled ? 0.5 : 1,
  width: 40,
  height: 40,
  transition: 'transform 200ms ease-in-out',
  transform: `rotate(${direction === ASCENDING ? 180 : 0}deg)`,
});
