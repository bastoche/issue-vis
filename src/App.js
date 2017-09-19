import './App.css';
import '../node_modules/react-vis/dist/style.css';

import React, { Component } from 'react';
import R from 'ramda';

import { fetchIssues, fetchAllIssues, issuesUrl } from './github.js';
import {
  countByCreationDay,
  buildSeriesDataFromDatesWithValues,
} from './series.js';
import { getAllLabels, filterIssuesWithLabels } from './labels.js';
import { TimeChart } from './timechart.js';
import { Checkbox } from './checkbox.js';

function repositories() {
  return process.env.REACT_APP_REPOSITORIES.split(',');
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { issues: {}, checkedLabels: [] };
  }

  componentWillMount() {
    repositories().map(repository => this.fetchAllIssues(repository));
  }

  fetchAllIssues(repository) {
    fetchAllIssues(
      issuesUrl(repository),
      fetchIssues,
      this.onIssuesFetched(repository)
    );
  }

  onIssuesFetched = key => {
    return issues => {
      this.setState((prevState, props) => {
        const prevIssues = prevState.issues[key];
        const totalIssues = prevIssues ? prevIssues.concat(issues) : issues;
        return {
          ...prevState,
          issues: {
            ...prevState.issues,
            [key]: totalIssues,
          },
        };
      });
    };
  };

  render() {
    const repositoryLink = repository => `https://www.github.com/${repository}`;
    return (
      <div className="App">
        <h1>issue-vis</h1>
        <h2>Data sources</h2>
        <ul>
          {repositories().map(repository => (
            <li key={repository}>
              <a href={repositoryLink(repository)}>{repository}</a>
            </li>
          ))}
        </ul>
        <h3>Labels</h3>
        {this.renderLabels()}
        <h2>New issues</h2>
        {this.renderOpenedIssues()}
      </div>
    );
  }

  renderLabels() {
    const issues = R.flatten(R.values(this.state.issues));
    if (issues) {
      const labels = getAllLabels(issues);
      return labels.map(label => (
        <Checkbox
          label={label}
          key={label}
          checked={this.state.checkedLabels.includes(label)}
          onCheckboxChanged={this.handleCheckboxChanged}
        />
      ));
    }
    return 'Fetching...';
  }

  handleCheckboxChanged = label => {
    this.setState((prevState, props) => {
      if (prevState.checkedLabels.includes(label)) {
        return {
          ...prevState,
          checkedLabels: prevState.checkedLabels.filter(
            checkedLabel => checkedLabel !== label
          ),
        };
      }
      return {
        ...prevState,
        checkedLabels: [...prevState.checkedLabels, label],
      };
    });
  };

  renderOpenedIssues() {
    const buildNewIssuesSeries = issues =>
      buildSeriesDataFromDatesWithValues(
        countByCreationDay(
          filterIssuesWithLabels(issues, this.state.checkedLabels)
        )
      );
    const data = R.map(buildNewIssuesSeries, this.state.issues);
    return <TimeChart data={data} items={repositories()} />;
  }
}

export default App;
