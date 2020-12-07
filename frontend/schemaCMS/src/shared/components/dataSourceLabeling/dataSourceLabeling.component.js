import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { keys, equals } from 'ramda';

import { Container, FieldType, FieldName, customSelectStyles, FieldTypeHeader } from './dataSourceLabeling.styles';
import { Select } from '../form/select';
import { renderWhenTrue } from '../../utils/rendering';
import { TextInput } from '../form/inputs/textInput';

const DEFAULT_TYPES = [
  { value: 'string', label: 'String' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'date', label: 'Date' },
  { value: 'int', label: 'Integer' },
  { value: 'number', label: 'Number' },
  { value: 'img', label: 'Image' },
];

export const DataSourceLabeling = ({ dataSource, onSelect }) => {
  const { fields } = dataSource;

  const [mappedFields, setMappedFields] = useState();

  useEffect(() => {
    setMappedFields(fields);
  }, [fields]);

  const updateMappedField = (field, key, value) => {
    const newFieldType = {
      ...mappedFields[field],
      [key]: value,
    };

    const newMappedFields = {
      ...mappedFields,
      [field]: newFieldType,
    };

    setMappedFields(newMappedFields);
    onSelect(newMappedFields);
  };

  const onSelectField = field => ({ value: dtype }) => {
    updateMappedField(field, 'dtype', dtype);
  };

  const handleInputChange = field => ({ currentTarget: { value } }) => {
    updateMappedField(field, 'param', value);
  };

  const renderDateField = isDate => field =>
    renderWhenTrue(() => (
      <TextInput
        name={`date${field}`}
        placeholder="dd/mm/YYYY"
        value={mappedFields[field].param}
        onChange={handleInputChange(field)}
      />
    ))(isDate);

  const renderField = field => {
    return (
      <FieldType key={field}>
        <FieldName>{field}</FieldName>
        <FieldName>{fields[field].dtype}</FieldName>
        <FieldName>
          <Select
            customStyles={customSelectStyles}
            name={field}
            value={mappedFields[field].dtype}
            options={DEFAULT_TYPES}
            onSelect={onSelectField(field)}
          />
          {renderDateField(equals('date', mappedFields[field].dtype))(field)}
        </FieldName>
      </FieldType>
    );
  };

  return (
    <Container>
      <FieldTypeHeader>
        <FieldType>
          <FieldName>Field</FieldName>
          <FieldName>Original Type</FieldName>
          <FieldName>Mapped Type</FieldName>
        </FieldType>
      </FieldTypeHeader>
      {keys(mappedFields).map(renderField)}
    </Container>
  );
};

DataSourceLabeling.propTypes = {
  dataSource: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};
