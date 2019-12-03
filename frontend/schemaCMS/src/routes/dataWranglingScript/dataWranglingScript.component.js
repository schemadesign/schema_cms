import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';

import { DataWranglingScriptComponent } from './dataWranglingScriptComponent/dataWranglingScript.component';
import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { IMAGE_SCRAPPING_SCRIPT_TYPE } from '../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { ImageScrappingScript } from './imageScrappingScriptComponent/imageScrappingScript.component';

export class DataWranglingScript extends PureComponent {
  static propTypes = {
    dataWranglingScript: PropTypes.object,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    fetchDataWranglingScript: PropTypes.func.isRequired,
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    const {
      match: {
        params: { scriptId },
      },
    } = this.props;
    await this.props.fetchDataWranglingScript({ scriptId });
    this.setState({ loading: false });
  }

  renderGeneralOrCustomRoute = renderWhenTrueOtherwise(
    () => <ImageScrappingScript {...this.props} />,
    () => <DataWranglingScriptComponent {...this.props} />
  );

  render() {
    const { dataWranglingScript } = this.props;
    const { loading } = this.state;
    const isCustom = dataWranglingScript.specs.type === IMAGE_SCRAPPING_SCRIPT_TYPE;

    return (
      <LoadingWrapper loading={loading} noData={isEmpty(dataWranglingScript)}>
        {this.renderGeneralOrCustomRoute(isCustom)}
      </LoadingWrapper>
    );
  }
}
