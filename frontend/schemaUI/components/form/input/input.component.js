import React, { Fragment, useRef, memo, useState } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './input.styles';
import { withStyles } from '../../styles/withStyles';
import { filterAllowedAttributes } from '../../../utils/helpers';

const InputComponent = memo(({ customStyles = {}, autoWidth = false, theme, inputRef, ...restProps }) => {
  const spanRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(null);
  const [alternativeValue, setAlternativeValue] = useState(restProps.value);
  const { defaultStyles, hiddenStyles } = getStyles(theme);
  const inputStyles = { ...defaultStyles, ...customStyles };
  const filteredProps = filterAllowedAttributes('input', restProps);

  const handleChange = e => {
    if (autoWidth) {
      setAlternativeValue(e.target.value);
      const { value, name, id } = e.target;

      return setTimeout(() => {
        setInputWidth(spanRef.current.offsetWidth);
        filteredProps.onChange({ target: { name, value, id } });
      });
    }

    filteredProps.onChange(e);
  };

  return (
    <Fragment>
      <input
        id={restProps.name}
        style={inputWidth ? { ...inputStyles, width: inputWidth + 5 } : inputStyles}
        ref={inputRef}
        {...filteredProps}
        onChange={handleChange}
      />
      {autoWidth ? (
        <div style={{ ...inputStyles, ...hiddenStyles }} ref={spanRef}>
          {alternativeValue}
        </div>
      ) : null}
    </Fragment>
  );
});

InputComponent.propTypes = {
  customStyles: PropTypes.object,
  theme: PropTypes.object,
  autoWidth: PropTypes.bool,
};

export const Input = withStyles(InputComponent);
