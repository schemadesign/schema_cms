import React from 'react';
import { shallow } from 'enzyme';

import { SourceFormComponent } from '../sourceForm.component';
import { defaultProps } from '../sourceForm.stories';
import { TextInput } from '../../form/inputs/textInput';
import { ErrorWrapper, WarningWrapper } from '../sourceForm.styles';
import { JOB_STATE_PROCESSING } from '../../../../modules/job/job.constants';

describe('SourceFormComponent: Component', () => {
  const component = props => <SourceFormComponent {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render file uploader', () => {
    const props = {
      dataSource: {
        type: 'file',
      },
    };
    const wrapper = render(props);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render error wrapper', () => {
    const props = {
      dataSource: {
        id: 'id',
        type: 'file',
        fileName: null,
      },
    };
    const warningWrapper = render(props).find(ErrorWrapper);

    expect(warningWrapper).toMatchSnapshot();
  });

  it('should render warning wrapper with uploading file', () => {
    const props = {
      dataSource: {
        id: 'id',
        type: 'file',
        fileName: null,
      },
      uploadingDataSources: [{ id: 'id' }],
    };
    const warningWrapper = render(props).find(WarningWrapper);

    expect(warningWrapper).toMatchSnapshot();
  });

  it('should render warning wrapper with job ongoing', () => {
    const props = {
      dataSource: {
        id: 'id',
        type: 'file',
        fileName: 'fileName',
        jobsState: {
          lastJobStatus: JOB_STATE_PROCESSING,
        },
      },
    };
    const warningWrapper = render(props).find(WarningWrapper);

    expect(warningWrapper).toMatchSnapshot();
  });

  it('should call handleChange on change of TextInput value', () => {
    jest.spyOn(defaultProps, 'handleChange');

    const wrapper = render();

    wrapper
      .find(TextInput)
      .first()
      .prop('onChange')();

    expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
  });
});
