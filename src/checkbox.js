import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Checkbox extends Component {
  handleCheckboxChange = () => {
    const { onCheckboxChanged, label } = this.props;
    onCheckboxChanged(label);
  };

  render() {
    const { label } = this.props;

    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            value={label}
            checked={this.props.checked}
            onChange={this.handleCheckboxChange}
          />
          {label}
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onCheckboxChanged: PropTypes.func.isRequired,
};

export default Checkbox;
