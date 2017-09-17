import './App.css';
import '../node_modules/react-vis/dist/style.css';

import React, { Component } from 'react';
import {
  FlexibleXYPlot,
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
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
    this.state = { issues: null };
  }

  componentWillMount() {
    this.fetchNextIssues();
  }

  fetchNextIssues(
    url = `https://api.github.com/repos/${process.env
      .REACT_APP_REPOSITORY}/issues`
  ) {
    fetchIssues(url)
      .then(result => {
        const { issues, next } = result;
        this.setState((prevState, props) => {
          const prevIssues = prevState.issues;
          const totalIssues = prevIssues ? prevIssues.concat(issues) : issues;
          return {
            issues: totalIssues,
          };
        });
        if (next) {
          this.fetchNextIssues(next);
        }
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
    const issues = this.state.issues;
    if (issues) {
      const issuesByCreationDay = buildSeriesDataFromDatesWithValues(
        countByCreationDay(issues)
      );
      return (
        <FlexibleXYPlot height={300}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickFormat={value => format(parse(value), 'MMM Do')} />
          <YAxis />
          <LineSeries data={issuesByCreationDay} />
        </FlexibleXYPlot>
      );
    } else {
      return 'Fetching...';
    }
  }
}

export default App;
