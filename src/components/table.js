import React, { Component } from 'react';
import PropTypes from 'prop-types';

import R from 'ramda';
import { format, getTime } from 'date-fns';

export class Table extends Component {
  render() {
    const repositories = this.props.repositories;
    const cumulatedCountByRepository = this.props.cumulatedCountByRepository;
    return (
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Total</th>
            {repositories.map(repository => (
              <th key={repository}>{repository}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props.days.map(day => (
            <tr key={day}>
              <td>{format(day, 'MM/DD/YYYY')}</td>
              <td>
                {R.reduce(
                  (acc, repo) =>
                    acc + (cumulatedCountByRepository[repo][getTime(day)] || 0),
                  0,
                  repositories
                )}
              </td>
              {repositories.map(repository => (
                <td key={repository + day}>
                  {cumulatedCountByRepository[repository][getTime(day)] || 0}
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
