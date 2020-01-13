import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import { Form } from 'schemaUI';

import { NextButton } from '../../../../shared/components/navigation';
import { DataWranglingScripts } from '../dataWranglingScripts.component';
import { defaultProps } from '../dataWranglingScripts.stories';

describe('DataWranglingScripts: Component', () => {
  const component = props => <DataWranglingScripts {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly form', async () => {
    defaultProps.fetchDataWranglingScripts = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = await render()
      .find(Formik)
      .dive();
    global.expect(wrapper).toMatchSnapshot();
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

    global.expect(defaultProps.fetchDataWranglingScripts).toBeCalledWith({ dataSourceId: '1', fromScript: true });
  });

  it('should call uploadScript on change of uploader file', () => {
    jest.spyOn(defaultProps, 'uploadScript');

    const wrapper = render();
    wrapper
      .find(Form.FileUpload)
      .first()
      .prop('onChange')({ target: { files: [{ name: 'filename.py' }] } });
    global.expect(defaultProps.uploadScript).toHaveBeenCalledTimes(1);
  });

  it('should call sendUpdatedDataWranglingScript on save changes', async () => {
    defaultProps.fetchDataWranglingScripts = jest.fn().mockReturnValue(Promise.resolve());

    const sendUpdatedDataWranglingScript = jest
      .spyOn(defaultProps, 'sendUpdatedDataWranglingScript')
      .mockImplementation(() => {
        global.expect(sendUpdatedDataWranglingScript).toHaveBeenCalledTimes(1);
      });

    const wrapper = await render({
      sendUpdatedDataWranglingScript,
    })
      .find(Formik)
      .dive();

    wrapper
      .find(NextButton)
      .at(0)
      .simulate('click');
  });
});
