import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import { Form } from 'schemaUI';

import { DataWranglingScripts } from '../dataWranglingScripts.component';
import { defaultProps } from '../dataWranglingScripts.stories';
import { Draggable } from '../../../../shared/components/draggable';

describe('DataWranglingScripts: Component', () => {
  const component = props => <DataWranglingScripts {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly form', async () => {
    defaultProps.fetchDataWranglingScripts = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = await render()
      .find(Formik)
      .dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchDataWranglingScripts on componentDidMount', () => {
    jest.spyOn(defaultProps, 'fetchDataWranglingScripts');

    render({
      history: {
        ...defaultProps.history,
        location: {
          state: {
            fromScript: true,
          },
        },
      },
    });

    expect(defaultProps.fetchDataWranglingScripts).toBeCalledWith({ dataSourceId: '1', fromScript: true });
  });

  it('should call uploadScript on change of uploader file', () => {
    jest.spyOn(defaultProps, 'uploadScript');

    const wrapper = render();
    wrapper
      .find(Form.FileUpload)
      .first()
      .prop('onChange')({ target: { files: [{ name: 'filename.py' }] } });
    expect(defaultProps.uploadScript).toHaveBeenCalledTimes(1);
  });

  it('should return error on upload file with too long name', () => {
    const wrapper = render();
    const name = 'someverylongfilename-someverylongfilename-someverylongfilename-someverylongfilename.py';
    wrapper
      .find(Form.FileUpload)
      .first()
      .prop('onChange')({ target: { files: [{ name }] } });

    expect(wrapper.state().errorMessage).toBe('errorTooLongName');
  });

  it('should return error on failed uploading', async () => {
    const wrapper = await render({
      fetchDataWranglingScripts: jest.fn().mockReturnValue(Promise.resolve()),
      uploadScript: jest.fn().mockReturnValue(Promise.reject('uploading file failed')),
    });

    await wrapper
      .find(Form.FileUpload)
      .first()
      .prop('onChange')({ target: { files: [{ name: 'filename.py' }] } });

    expect(wrapper.state().errorMessage).toBe('errorOnUploading');
    expect(wrapper.state().uploading).toBeFalsy();
  });

  it('should call sendUpdatedDataWranglingScript on save changes', async () => {
    defaultProps.fetchDataWranglingScripts = jest.fn().mockReturnValue(Promise.resolve());

    jest.spyOn(defaultProps, 'sendUpdatedDataWranglingScript');

    const steps = { steps: ['1'] };

    await render()
      .find(Formik)
      .prop('onSubmit')(steps, { setSubmitting: Function.prototype });

    expect(defaultProps.sendUpdatedDataWranglingScript).toHaveBeenCalledTimes(1);
  });

  it('should call setScriptsList on change checkbox', async () => {
    const dataWranglingScripts = defaultProps.dataWranglingScripts.setIn([0, 'checked'], true);
    const props = {
      dataWranglingScripts,
      fetchDataWranglingScripts: jest.fn().mockReturnValue(Promise.resolve()),
      setScriptsList: Function.prototype,
    }
    jest.spyOn(props, 'setScriptsList');

    const wrapper = await render(props);

    wrapper
      .find(Formik)
      .dive()
      .find(Form.CheckboxGroup)
      .first()
      .prop('onChange')({target:
        { value: '3', checked: true },
      });

    expect(props.setScriptsList).toHaveBeenCalledTimes(1);
  });

  it('should call setScriptsList on move item', async () => {
    const dataWranglingScripts = defaultProps.dataWranglingScripts.setIn([0, 'checked'], true);
    const props = {
      dataWranglingScripts,
      fetchDataWranglingScripts: jest.fn().mockReturnValue(Promise.resolve()),
      setScriptsList: Function.prototype,
    }
    jest.spyOn(props, 'setScriptsList');

    const wrapper = await render(props);

    wrapper
      .find(Formik)
      .dive()
      .find(Draggable)
      .first()
      .prop('onMove')(1, 0);

    expect(props.setScriptsList).toHaveBeenCalledTimes(1);
  });
});
