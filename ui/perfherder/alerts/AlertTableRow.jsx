import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarRegular, faStarSolid } from '@fortawesome/free-solid-svg-icons';

// TODO remove $stateParams and $state after switching to react router
export default class AlertTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
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

  render() {
    const { alertSummary, user, alert } = this.props;
    return (
      <tr>
        <td>
        <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                disabled={!user.isStaff}
                // onClick={this.selectAlert}
              />
            </Label>
          </FormGroup>
        </td>
        <td>
          <span role="button">
            {/* <FontAwesomeIcon icon={faExternalLinkAlt} /> */}
          </span>
        </td>
      {/* 
      <td class="alert-labels">
        <a ng-attr-title="{{alert.starred ? 'Starred': 'Not starred'}}"
          ng-class="{'visible': alert.starred}"
          ng-disabled="!user.isStaff"
          ng-click="toggleStar(alert)">
          <i ng-class="{'fas fa-star': alert.starred, 'far fa-star': !alert.starred}"></i>
        </a>
      </td> */}
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
