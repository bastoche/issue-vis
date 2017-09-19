import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  DiscreteColorLegend,
  FlexibleXYPlot,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  YAxis,
} from 'react-vis';

export class TimeChart extends Component {
  render() {
    return (
      <FlexibleXYPlot height={300} xType="time" stackBy="y">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        {this.props.items.map(item => (
          <VerticalBarSeries key={item} data={this.props.data[item]} />
        ))}
        <DiscreteColorLegend
          orientation="horizontal"
          items={this.props.items}
        />
      </FlexibleXYPlot>
    );
  }
}

TimeChart.propTypes = {
  data: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
};
