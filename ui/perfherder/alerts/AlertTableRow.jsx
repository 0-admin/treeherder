import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

import { update } from '../../helpers/http';
import { getApiUrl } from '../../helpers/url';
import { endpoints } from '../constants';

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

    return (
      <tr className="alert-row">
        <td>
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
