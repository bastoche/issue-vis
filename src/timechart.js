import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexibleXYPlot,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  YAxis,
} from 'react-vis';

export class TimeChart extends Component {
  render() {
    const data = this.props.data;
    return (
      <FlexibleXYPlot height={300} xType="time" stackBy="y">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalBarSeries data={data} />
      </FlexibleXYPlot>
    );
  }
}

TimeChart.propTypes = {
  data: PropTypes.array.isRequired,
};
