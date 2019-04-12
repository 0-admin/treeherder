import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

import { update } from '../../helpers/http';
import { getApiUrl } from '../../helpers/url';
import { endpoints } from '../constants';
import { getAlertStatus, getSubtestsURL, getGraphsURL } from '../helpers';
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

  getReassignment = alert => {
    let text = 'to';
    let alertId = alert.related_summary_id;

    if (alert.related_summary_id === this.props.alertSummary.id) {
      text = 'from';
      alertId = alert.summary_id;
    }
    return (
      <span>
        {` ${text} `}
        <a
          href={`#/alerts?id=${alertId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-info"
        >{`alert #${alertId}`}</a>
      </span>
    );
  };

  getTitleText = (alert, alertStatus) => {
    const { repository, framework, resultSetMetadata } = this.props.alertSummary;
  
    let statusColor = '';
    if (alertStatus === 'invalid') {
      statusColor = 'text-danger';
    }
    if (alertStatus === 'untriaged') {
      statusColor = 'text-success';
    }

    return (
      <span>
        {`${alert.title} (`}
        <span className={statusColor}>{alertStatus}</span>
        {alert.related_summary_id && this.getReassignment(alert)}){' '}
        <span className="result-links">
          <a href={getGraphsURL(alert, resultSetMetadata.timeRange, repository, framework)} target="_blank" rel="noopener noreferrer"> graph</a>
          {alert.series_signature.has_subtests &&
          <a href={getSubtestsURL(alert, this.props.alertSummary)} target="_blank" rel="noopener noreferrer"> · subtests</a>}
        </span>
      </span>
    );
  };

  render() {
    const { user, alert } = this.props;
    const { starred } = this.state;

    const alertStatus = getAlertStatus(alert);
    const tooltipText = alert.classifier_email
      ? `Classified by ${alert.classifier_email}`
      : 'Classified automatically';

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
        <td className="alert-title">
          {alertStatus !== 'untriaged' ? (
            <SimpleToolTip
              text={this.getTitleText(alert, alertStatus)}
              tooltipText={tooltipText}
            />
          ) : (
            <span>{this.getTitleText(alert, alertStatus)}</span>
          )}
        </td>
      </tr>
    );
  }
}

AlertTableRow.propTypes = {
  alertSummary: PropTypes.shape({
    repository: PropTypes.string,
    framework: PropTypes.number,
    resultSetMetadata: PropTypes.shape({}),
    id: PropTypes.number,
  }).isRequired,
  user: PropTypes.shape({}),
  alert: PropTypes.shape({
    starred: PropTypes.bool,    
  }).isRequired,
};

AlertTableRow.defaultProps = {
  user: null,
};
