import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container, Max, Min, SelectedSlider, Slider } from './rangeSlider.styles';

export class RangeSlider extends PureComponent {
  static propTypes = {
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    idMin: PropTypes.string.isRequired,
    idMax: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    min: 0,
    max: 100,
  };

  render() {
    const { min, max, minValue, maxValue, onChange, idMin, idMax } = this.props;
    const roundedMin = parseInt(min, 10);
    const roundedMax = parseInt(max % 1 ? max + 1 : max, 10);
    const mapBetween = (currentNum, minAllowed, maxAllowed, min, max) =>
      ((maxAllowed - minAllowed) * (currentNum - min)) / (max - min) + minAllowed;

    const left = mapBetween(minValue, 0, 100, roundedMin, roundedMax);
    const right = mapBetween(maxValue, 0, 100, roundedMin, roundedMax);
    const width = right - left;

    return (
      <Container>
        <Slider />
        <SelectedSlider left={left} size={width} />
        <Min
          min={roundedMin}
          max={roundedMax}
          value={minValue}
          type="range"
          id={idMin}
          name={idMin}
          onChange={onChange}
        />
        <Max
          min={roundedMin}
          max={roundedMax}
          value={maxValue}
          type="range"
          id={idMax}
          name={idMax}
          onChange={onChange}
        />
      </Container>
    );
  }
}
