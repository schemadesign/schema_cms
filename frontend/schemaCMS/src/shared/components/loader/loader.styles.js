import styled, { keyframes } from 'styled-components';

const SIZE = 20;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  display: inline-block;
  position: relative;
  width: ${SIZE}px;
  height: ${SIZE}px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${SIZE}px;
    height: ${SIZE}px;
    border: ${SIZE / 8}px solid #fff;
    border-radius: 50%;
    animation: ${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  div:nth-child(1) {
    animation-delay: -0.45s;
  }
  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;
