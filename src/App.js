import './App.css';
import '../node_modules/react-vis/dist/style.css';

import React, { Component } from 'react';
import {
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';
import { format, parse } from 'date-fns';

import { fetchIssues } from './github.js';
import {
  countByCreationDay,
  buildSeriesDataFromDatesWithValues,
} from './series.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { issuesByCreationDay: null };
  }

  componentWillMount() {
    fetchIssues()
      .then(issues => {
        this.setState((prevState, props) => {
          return {
            issuesByCreationDay: buildSeriesDataFromDatesWithValues(
              countByCreationDay(issues)
            ),
          };
        });
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <div className="App">
        <h1>issue-vis</h1>
        <h2>Opened issues</h2>
        {this.renderOpenedIssues()}
      </div>
    );
  }

  renderOpenedIssues() {
    const issuesByCreationDay = this.state.issuesByCreationDay;
    if (issuesByCreationDay) {
      console.log(issuesByCreationDay);
      return (
        <XYPlot height={300} width={300}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickFormat={value => format(parse(value), 'YYYY-MM-DD')} />
          <YAxis />
          <LineSeries data={issuesByCreationDay} />
        </XYPlot>
      );
    } else {
      return 'Fetching...';
    }
  }
}

export default App;
