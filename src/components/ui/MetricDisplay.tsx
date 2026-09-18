'use client';

import React from 'react';
import { StatMetric, StatMetricProps } from './StatMetric';

export const MetricDisplay: React.FC<StatMetricProps> = (props) => {
  return <StatMetric {...props} />;
};

export default MetricDisplay;
