import React, { Component } from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';

class App extends Component {
  componentWillMount() {
    const headers = new Headers();
    headers.append('Accept', 'application/vnd.github.v3+json');
    headers.append(
      'Authorization',
      `token ${process.env.REACT_APP_GITHUB_TOKEN}`
    );
    fetch(
      `https://api.github.com/repos/${process.env.REACT_APP_REPOSITORY}/issues`,
      {
        headers,
      }
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
      })
      .catch(error => console.error(error));
  }

  render() {
    const data = [
      { x: 0, y: 8 },
      { x: 1, y: 5 },
      { x: 2, y: 4 },
      { x: 3, y: 9 },
      { x: 4, y: 1 },
      { x: 5, y: 7 },
      { x: 6, y: 6 },
      { x: 7, y: 3 },
      { x: 8, y: 2 },
      { x: 9, y: 0 },
    ];
    return (
      <div className="App">
        <h1>issue-vis</h1>
        <h2>New issues</h2>
        <XYPlot height={300} width={300}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <LineSeries data={data} />
        </XYPlot>
      </div>
    );
  }
}

export default App;
