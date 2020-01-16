import React from 'react';
import { shallow } from 'enzyme';
import { Form } from 'schemaUI';

import { DataWranglingScripts } from '../dataWranglingScripts.component';
import { defaultProps } from '../dataWranglingScripts.stories';
import { NextButton } from '../../../../shared/components/navigation';
import { IMAGE_SCRAPING_SCRIPT_TYPE } from '../../../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { Draggable } from '../../../../shared/components/draggable';

const { FileUpload, CheckboxGroup } = Form;

describe('DataWranglingScripts: Component', () => {
  const component = props => <DataWranglingScripts {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render empty list', async () => {
    const wrapper = await render({ dataWranglingScripts: [] });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render only unchecked scripts', async () => {
    const wrapper = await render({ checkedScripts: [] });
    const checkboxGroup = wrapper.find(CheckboxGroup);
    expect(checkboxGroup).toMatchSnapshot();
  });

  it('should render only checked scripts', async () => {
    const wrapper = await render({ uncheckedScripts: [] });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchDataWranglingScripts', async () => {
    jest.spyOn(defaultProps, 'fetchDataWranglingScripts');
    await render();
    expect(defaultProps.fetchDataWranglingScripts).toBeCalledWith({ dataSourceId: '1', fromScript: false });
  });

  it('should call setCheckedScripts', async () => {
    jest.spyOn(defaultProps, 'setCheckedScripts');
    const checkedScripts = [{ id: 1 }, { id: 2 }];
    const wrapper = await render({ checkedScripts });
    wrapper
      .find(Draggable)
      .first()
      .prop('onMove')(0, 1);

    expect(defaultProps.setCheckedScripts).toBeCalledWith(checkedScripts.reverse());
  });

  it('should call setScriptsList', async () => {
    jest.spyOn(defaultProps, 'setScriptsList');
    const checkedScripts = [{ id: 1 }, { id: 2 }];
    const e = { target: { value: '1', checked: false } };
    const wrapper = await render({ checkedScripts });
    wrapper
      .find(CheckboxGroup)
      .first()
      .prop('onChange')(e);

    expect(defaultProps.setScriptsList).toBeCalledWith({ checked: false, script: { id: 1 } });
  });

  it('should redirect to image script page', async () => {
    jest.spyOn(defaultProps.history, 'push');
    const checkedScripts = [{ id: 1 }];
    const uncheckedScripts = [{ id: 2, specs: { type: IMAGE_SCRAPING_SCRIPT_TYPE } }];
    const e = { target: { value: '2', checked: true } };
    const wrapper = await render({ checkedScripts, uncheckedScripts, imageScrapingFields: [] });
    wrapper
      .find(CheckboxGroup)
      .first()
      .prop('onChange')(e);

    expect(defaultProps.history.push).toBeCalledWith('/script/2/1');
  });

  it('should call fetchDataWranglingScripts with fromScript on true', async () => {
    jest.spyOn(defaultProps, 'fetchDataWranglingScripts');
    await render({ history: { location: { state: { fromScript: true } }, push: Function.prototype } });
    expect(defaultProps.fetchDataWranglingScripts).toBeCalledWith({ dataSourceId: '1', fromScript: true });
  });

  it('should call sendUpdatedDataWranglingScript', async () => {
    jest.spyOn(defaultProps, 'sendUpdatedDataWranglingScript');
    const wrapper = await render();
    wrapper.find(NextButton).simulate('click');
    expect(defaultProps.sendUpdatedDataWranglingScript).toBeCalledWith({
      dataSourceId: '1',
      steps: [{ execOrder: 0, script: 1 }],
    });
  });

  it('should call uploadScript', async () => {
    jest.spyOn(defaultProps, 'uploadScript');
    const wrapper = await render();
    wrapper.find(FileUpload).simulate('change', { target: { files: [{ name: 'name' }] } });
    expect(defaultProps.uploadScript).toBeCalledWith({ dataSourceId: '1', script: { name: 'name' } });
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchDataWranglingScripts should return error';
    const wrapper = await render({
      fetchDataWranglingScripts: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
