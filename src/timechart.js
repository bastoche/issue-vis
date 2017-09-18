import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexibleXYPlot,
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  YAxis,
} from 'react-vis';

export class TimeChart extends Component {
  render() {
    const data = this.props.data;
    return (
      <FlexibleXYPlot height={300} xType="time">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <LineSeries data={data} />
      </FlexibleXYPlot>
    );
  }
}

TimeChart.propTypes = {
  data: PropTypes.array.isRequired,
};
