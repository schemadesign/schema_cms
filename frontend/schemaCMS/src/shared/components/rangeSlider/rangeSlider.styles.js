import styled, { css } from 'styled-components';

const SLIDE_SIZE = '24px';

export const Container = styled.div`
  height: ${SLIDE_SIZE};
  min-width: 100%;
  position: relative;
  display: flex;
  align-items: center;
`;

export const Slider = styled.div`
  height: 3px;
  background: ${({ theme }) => theme.slider.background};
  width: 100%;
`;

export const SelectedSlider = styled.div`
  height: 3px;
  background: ${({ theme }) => theme.slider.selectedBackground};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: ${({ size }) => `${size}%`};
  left: ${({ left }) => `${left}%`};
`;

export const slideStyles = css`
  width: ${SLIDE_SIZE};
  height: ${SLIDE_SIZE};
  background: ${({ theme }) => theme.slider.thumb};
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;
`;

export const sliderStyles = css`
  appearance: none;
  width: 100%;
  height: ${SLIDE_SIZE};
  background: transparent;
  outline: none;
  pointer-events: none;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;

  &::-webkit-slider-thumb {
    appearance: none;
    ${slideStyles};
  }

  &::-moz-range-thumb {
    ${slideStyles};
  }
`;
export const Min = styled.input`
  ${sliderStyles};
`;
export const Max = styled.input`
  ${sliderStyles};
`;
