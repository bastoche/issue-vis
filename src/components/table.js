import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { format, getTime } from 'date-fns';

export class Table extends Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Day</th>
            {this.props.repositories.map(repository => (
              <th key={repository}>{repository}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props.days.map(day => (
            <tr key={day}>
              <td>{format(day, 'MM/DD/YYYY')}</td>
              {this.props.repositories.map(repository => (
                <td key={repository + day}>
                  {this.props.cumulatedCountByRepository[repository][
                    getTime(day)
                  ] || 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  repositories: PropTypes.array.isRequired,
  days: PropTypes.array.isRequired,
  cumulatedCountByRepository: PropTypes.object.isRequired,
};
