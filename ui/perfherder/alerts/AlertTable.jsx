import React from 'react';
import PropTypes from 'prop-types';
import { react2angular } from 'react2angular/index.es2015';
import { Container, Form, FormGroup, Label, Input, Table } from 'reactstrap';

import perf from '../../js/perf';

import AlertHeader from './AlertHeader';
import StatusDropdown from './StatusDropdown';

// TODO remove $stateParams and $state after switching to react router
export class AlertTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertSummary: this.props.alertSummary,
    };
  }

  componentDidUpdate(prevProps) {
    const { alertSummary } = this.props;
    if (prevProps.alertSummary !== alertSummary) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ alertSummary });
    }
  }

  selectAlerts = () => {
    const { alertSummary: oldAlertSummary } = this.state;
    const alertSummary = { ...oldAlertSummary };
    alertSummary.allSelected = !alertSummary.allSelected;

    alertSummary.alerts.forEach(function selectAlerts(alert) {
      alert.selected = alert.visible && alertSummary.allSelected;
    });
    this.setState({ alertSummary });
    this.props.$rootScope.$apply();
  };

  // TODO figure out how to structure this - alert.selected needs to be updated
  // do we need to use alert.visible as per updateAlertVisibility in controller?
  selectAlert = () => {
    const { alertSummary: oldAlertSummary } = this.state;
    const alertSummary = { ...oldAlertSummary };

    if (alertSummary.alerts.every(alert => !alert.visible || alert.selected)) {
        alertSummary.allSelected = true;
    } else {
        alertSummary.allSelected = false;
    }
    this.props.$rootScope.$apply();    
  };

  render() {
    const { user, $rootScope, repos } = this.props;
    const { alertSummary } = this.state;
    console.log(alertSummary);
    return (
      <Container fluid className="px-0">
        <Form>
          <Table>
            <thead>
              <tr className="bg-lightgray">
                <th className="text-left alert-summary-header-element">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        disabled={!user.isStaff}
                        onClick={this.selectAlerts}
                      />
                      <AlertHeader alertSummary={alertSummary} />
                    </Label>
                  </FormGroup>
                </th>
                <th />
                <th />
                <th />
                <th />
                <th />
                <th className="table-width-sm align-top font-weight-normal">
                  <StatusDropdown
                    alertSummary={alertSummary}
                    repos={repos}
                    user={user}
                    $rootScope={$rootScope}
                    updateAlertSummary={alertSummary =>
                      this.setState({ alertSummary })
                    }
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {/* // TODO orderBy: ['-starred', 'title'] */}
              {alertSummary.alerts.map(alert => (
              alert.visible &&
              <tr key={alert.id}>
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
              {/* 
              <td class="alert-checkbox">
                <input type="checkbox" ng-disabled="!user.isStaff" ng-model="alert.selected" ng-change="alertSelected(alertSummary)"/>
              </td>
              <td class="alert-labels">
                <a ng-attr-title="{{alert.starred ? 'Starred': 'Not starred'}}"
                  ng-class="{'visible': alert.starred}"
                  ng-disabled="!user.isStaff"
                  ng-click="toggleStar(alert)">
                  <i ng-class="{'fas fa-star': alert.starred, 'far fa-star': !alert.starred}"></i>
                </a>
              </td> */}
              </tr>))}
            </tbody>
          </Table>
        </Form>
      </Container>
    );
  }
}

AlertTable.propTypes = {
  $stateParams: PropTypes.shape({}),
  $state: PropTypes.shape({}),
  alertSummary: PropTypes.shape({}),
  user: PropTypes.shape({}),
  repos: PropTypes.arrayOf(PropTypes.shape({})),
  $rootScope: PropTypes.shape({
    $apply: PropTypes.func,
  }).isRequired,
};

AlertTable.defaultProps = {
  $stateParams: null,
  $state: null,
  alertSummary: null,
  user: null,
  repos: null,
};

perf.component(
  'alertTable',
  react2angular(
    AlertTable,
    ['alertSummary', 'user', 'repos'],
    ['$stateParams', '$state', '$rootScope'],
  ),
);

export default AlertTable;
