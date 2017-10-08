import './app.css';
import '../../node_modules/react-vis/dist/style.css';

import React, { Component } from 'react';
import R from 'ramda';
import { format, getTime } from 'date-fns';

import { fetchIssues, fetchAllIssues, issuesUrl } from '../github/issues.js';
import {
  buildSeriesDataFromDatesWithValues,
  countByCreationDay,
  cumulatedCount,
  getAllDaysBetweenIssues,
} from '../github/series.js';
import { getAllLabels, filterIssuesWithLabels } from '../github/labels.js';
import { TimeChart } from './timechart.js';
import { Table } from './table.js';
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
        <h1 className="no-print">issue-vis</h1>
        <h2 className="no-print">Data sources</h2>
        {this.renderRepositories()}
        <h3 className="no-print">Labels</h3>
        {this.renderLabels()}
        <h2>New issues</h2>
        {this.renderOpenedIssues()}
        <h2>Cumulated issues</h2>
        {this.renderCumulatedIssues()}
      </div>
    );
  }

  renderRepositories() {
    return (
      <div className="no-print">
        {repositories().map(repository => (
          <Checkbox
            label={repository}
            key={repository}
            checked={this.state.checkedRepositories.includes(repository)}
            onCheckboxChanged={this.handleRepositoryCheckboxChanged}
          />
        ))}
      </div>
    );
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
      const style = {
        columnCount: 2,
        columnWidth: '50%',
      };
      return (
        <div style={style} className="no-print">
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

  checkedRepositories() {
    const isRepositoryChecked = repository =>
      this.state.checkedRepositories.includes(repository);
    return R.filter(isRepositoryChecked, repositories());
  }

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
    return <TimeChart data={data} items={this.checkedRepositories()} />;
  }

  renderCumulatedIssues() {
    const xRange = getAllDaysBetweenIssues(this.allIssues());
    const buildCumulatedCount = issues =>
      cumulatedCount(
        filterIssuesWithLabels(issues, this.state.checkedLabels),
        xRange
      );
    const cumulatedCountByRepository = R.map(
      buildCumulatedCount,
      this.state.issues
    );
    const chartData = R.map(
      cumulatedCount => buildSeriesDataFromDatesWithValues(cumulatedCount),
      cumulatedCountByRepository
    );
    const repositories = this.checkedRepositories();

    const headers = ['Day', 'Total'].concat(repositories);
    const rows = xRange.map(day => {
      const time = getTime(day);
      const total = R.reduce(
        (acc, repository) =>
          acc + (cumulatedCountByRepository[repository][time] || 0),
        0,
        repositories
      );
      return [format(day, 'MM/DD/YYYY'), total].concat(
        repositories.map(
          repository => cumulatedCountByRepository[repository][time] || 0
        )
      );
    });

    return (
      <div>
        <TimeChart data={chartData} items={repositories} />
        <div className="no-print">
          <Table headers={headers} rows={rows} />
        </div>
      </div>
    );
  }

  allIssues() {
    return R.flatten(R.values(this.state.issues));
  }
}

export default App;
