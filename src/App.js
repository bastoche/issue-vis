import './App.css';
import '../node_modules/react-vis/dist/style.css';

import React, { Component } from 'react';

import { fetchIssues } from './github.js';
import {
  countByCreationDay,
  buildSeriesDataFromDatesWithValues,
} from './series.js';
import { getAllLabels, filterIssuesWithLabels } from './labels.js';
import { TimeChart } from './timechart.js';
import { Checkbox } from './checkbox.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { issues: null, checkedLabels: [] };
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
    const repositoryLink = `https://www.github.com/${process.env
      .REACT_APP_REPOSITORY}`;
    return (
      <div className="App">
        <h1>issue-vis</h1>
        <h2>Data source</h2>
        <a href={repositoryLink}>{process.env.REACT_APP_REPOSITORY}</a>
        <h3>Labels</h3>
        {this.renderLabels()}
        <h2>New issues</h2>
        {this.renderOpenedIssues()}
      </div>
    );
  }

  renderLabels() {
    const issues = this.state.issues;
    if (issues) {
      const labels = getAllLabels(this.state.issues);
      return labels.map(label => (
        <Checkbox
          label={label}
          key={label}
          checked={this.state.checkedLabels.includes(label)}
          onCheckboxChanged={this.handleCheckboxChanged}
        />
      ));
    }
    return this.renderFetchingText();
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
    const issues = this.state.issues;
    if (issues) {
      const issuesByCreationDay = buildSeriesDataFromDatesWithValues(
        countByCreationDay(
          filterIssuesWithLabels(issues, this.state.checkedLabels)
        )
      );
      return <TimeChart data={issuesByCreationDay} />;
    }
    return this.renderFetchingText();
  }

  renderFetchingText() {
    return 'Fetching...';
  }
}

export default App;
