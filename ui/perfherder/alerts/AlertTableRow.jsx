import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

import { update } from '../../helpers/http';
import { getApiUrl } from '../../helpers/url';
import { endpoints } from '../constants';
import { getAlertStatus } from '../helpers';
import SimpleToolTip from '../../shared/SimpleTooltip';

// TODO remove $stateParams and $state after switching to react router
export default class AlertTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: this.props.alert,
      starred: this.props.alert.starred,
    };
  }

  // TODO figure out how to structure this - alert.selected needs to be updated
  // do we need to use alert.visible as per updateAlertVisibility in controller?
  selectAlert = () => {
    const { alertSummary: oldAlertSummary } = this.props;
    const alertSummary = { ...oldAlertSummary };

    if (alertSummary.alerts.every(alert => !alert.visible || alert.selected)) {
      alertSummary.allSelected = true;
    } else {
      alertSummary.allSelected = false;
    }
    // this.props.$rootScope.$apply();
  };

  // TODO error handling
  modifyAlert = (alert, modification) =>
    update(getApiUrl(`${endpoints.alert}${alert.id}/`), modification);

  toggleStar = async () => {
    const { starred, alert } = this.state;
    const updatedStar = {
      starred: !starred,
    };
    await this.modifyAlert(alert, updatedStar);
    this.setState(updatedStar);
  };

  render() {
    const { user, alert } = this.props;
    const { starred } = this.state;
    // TODO turn into a helper
    const alertStatus = getAlertStatus(alert);
    const tooltipText = alert.classifier_email
      ? `Classified by ${alert.classifier_email}`
      : 'Classified automatically';
    
    let statusColor = '';
    if (alertStatus === 'invalid') {
      statusColor = 'text-danger';
    }
    if (alertStatus === 'untriaged') {
      statusColor = 'text-success';
    }
    return (
      <tr className="alert-row">
        <td className="alert-checkbox">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                disabled={!user.isStaff}
                // onClick={() => console.log('selected')}
              />
              {/* <span className="alert-labels" onClick={(event) => { event.preventDefault(); this.setState({ starred : !starred }) }}>
                <FontAwesomeIcon title={starred ? "starred" : "not starred"} icon={starred ? faStarSolid : faStarRegular} />
              </span> */}
            </Label>
          </FormGroup>
        </td>
        <td className="alert-labels">
          <span className={starred ? 'visible' : ''} onClick={this.toggleStar}>
            <FontAwesomeIcon
              title={starred ? 'starred' : 'not starred'}
              icon={starred ? faStarSolid : faStarRegular}
            />
          </span>
        </td>
        {/* <td class="alert-title">
          <span ng-show="alert.related_summary_id">
            <!-- Reassigned or downstream *to* another alert -->
            <span ng-if="alert.related_summary_id !== alertSummary.id">
              to <a href="#/alerts?id={{alert.related_summary_id}}" target="_blank" rel="noopener">alert #{{alert.related_summary_id}}</a>
            </span>
            <!-- Reassigned or downstream *from* the another alert -->
            <span ng-if="alert.related_summary_id === alertSummary.id">
              from <a href="#/alerts?id={{alert.summary_id}}" target="_blank" rel="noopener" >alert #{{alert.summary_id}}</a>
            </span>
          </span>)&nbsp;&nbsp;
          <span class="result-links">
            <a href="{{getGraphsURL(alert, alertSummary.resultSetMetadata.timeRange, alertSummary.repository, alertSummary.framework)}}" target="_blank" rel="noopener">graph</a>
            <span ng-if="alert.series_signature.has_subtests"> · </span>
            <a ng-if="alert.series_signature.has_subtests" href="{{getSubtestsURL(alert, alertSummary)}}" target="_blank" rel="noopener">subtests</a>
          </span>
        </td> */}
        <td className="alert-title">
          {alertStatus !== 'untriaged' ? (
            <SimpleToolTip text={alert.title} tooltipText={tooltipText} />
          ) : (
            <span>{alert.title}</span>
          )}
          {' '}
          (<span className={statusColor}>{alertStatus}</span>)
        </td>
      </tr>
    );
  }
}

AlertTableRow.propTypes = {
  alertSummary: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}),
  alert: PropTypes.shape({}).isRequired,
};

AlertTableRow.defaultProps = {
  user: null,
};
