import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Table extends Component {
  render() {
    /* eslint-disable react/no-array-index-key */
    return (
      <table>
        <thead>
          <tr>
            {this.props.headers.map(header => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.props.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
    /* eslint-enable react/no-array-index-key */
  }
}

Table.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
};
