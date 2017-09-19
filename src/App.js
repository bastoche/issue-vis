import './App.css';
import '../node_modules/react-vis/dist/style.css';

import React, { Component } from 'react';
import R from 'ramda';

import { fetchIssues, fetchAllIssues, issuesUrl } from './github.js';
import {
  buildSeriesDataFromDatesWithValues,
  countByCreationDay,
  getAllDaysBetweenIssues,
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
    this.state = { issues: {}, checkedLabels: [], checkedRepositories: [] };
  }

  componentWillMount() {
    repositories().map(repository => this.fetchAllIssues(repository));
  }

  fetchAllIssues(repository) {
    fetchAllIssues(
      issuesUrl(repository),
      fetchIssues(process.env.REACT_APP_GITHUB_TOKEN),
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
    return (
      <div className="App">
        <h1>issue-vis</h1>
        <h2>Data sources</h2>
        {this.renderRepositories()}
        <h3>Labels</h3>
        {this.renderLabels()}
        <h2>New issues</h2>
        {this.renderOpenedIssues()}
      </div>
    );
  }

  renderRepositories() {
    return repositories().map(repository => (
      <Checkbox
        label={repository}
        key={repository}
        checked={this.state.checkedRepositories.includes(repository)}
        onCheckboxChanged={this.handleRepositoryCheckboxChanged}
      />
    ));
  }

  handleRepositoryCheckboxChanged = repository => {
    this.setState((prevState, props) => {
      if (prevState.checkedRepositories.includes(repository)) {
        return {
          ...prevState,
          checkedRepositories: prevState.checkedRepositories.filter(
            checkedRepository => checkedRepository !== repository
          ),
        };
      }
      return {
        ...prevState,
        checkedRepositories: [...prevState.checkedRepositories, repository],
      };
    });
  };

  renderLabels() {
    const issues = this.allIssues();
    if (issues) {
      const labels = getAllLabels(issues);
      const style = { columnCount: 2, columnWidth: '50%' };
      return (
        <div style={style}>
          {labels.map(label => (
            <Checkbox
              label={label}
              key={label}
              checked={this.state.checkedLabels.includes(label)}
              onCheckboxChanged={this.handleLabelCheckboxChanged}
            />
          ))}
        </div>
      );
    }
    return 'Fetching...';
  }

  handleLabelCheckboxChanged = label => {
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
    const xRange = getAllDaysBetweenIssues(this.allIssues());
    const buildNewIssuesSeries = issues =>
      buildSeriesDataFromDatesWithValues(
        countByCreationDay(
          filterIssuesWithLabels(issues, this.state.checkedLabels),
          xRange
        )
      );
    const data = R.map(buildNewIssuesSeries, this.state.issues);
    const isRepositoryChecked = repository =>
      this.state.checkedRepositories.includes(repository);
    const items = R.filter(isRepositoryChecked, repositories());
    return <TimeChart data={data} items={items} />;
  }

  allIssues() {
    return R.flatten(R.values(this.state.issues));
  }
}

export default App;
