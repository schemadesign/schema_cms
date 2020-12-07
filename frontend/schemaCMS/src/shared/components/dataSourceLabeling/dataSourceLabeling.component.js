import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { keys } from 'ramda';

import { Container, FieldType, FieldName, customSelectStyles, FieldTypeHeader } from './dataSourceLabeling.styles';
import { Select } from '../form/select';

const DEFAULT_TYPES = [
  { value: 'string', label: 'String' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'date', label: 'Date' },
  { value: 'int', label: 'Integer' },
  { value: 'number', label: 'Number' },
];

export const DataSourceLabeling = ({ dataSource, onSelect }) => {
  const { fields } = dataSource;

  const [mappedFields, setMappedFields] = useState();

  useEffect(() => {
    setMappedFields(fields);
  }, [fields]);

  const onSelectField = field => ({ value: dtype }) => {
    const newFieldType = {
      ...mappedFields[field],
      dtype,
    };

    const newMappedFields = {
      ...mappedFields,
      [field]: newFieldType,
    };

    setMappedFields(newMappedFields);
    onSelect(newMappedFields);
  };

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
