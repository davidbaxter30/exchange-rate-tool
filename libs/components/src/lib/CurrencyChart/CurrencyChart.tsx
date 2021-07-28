import { useState } from 'react';
import Plot from 'react-plotly.js';
import { ChartData } from './ChartData';

type PropTypes = {
  chartData: ChartData;
  fromName: string;
  toName: string;
}

export const CurrencyChart = ({ chartData, fromName, toName }: PropTypes) => {
  const [originalFromName, setOriginalFromName] = useState<string>(fromName);
  const [originalToName, setOriginalToname] = useState<string>(toName);

  return (
    <Plot
      data={[
        {
          x: chartData.financialChartXValues,
          close: chartData.financialChartCloseValues,
          decreasing: { line: { color: 'red' } },
          high: chartData.financialChartHighValues,
          increasing: { line: { color: 'green' } },
          line: { color: 'rgba(31,119,180,1)' },
          low: chartData.financialChartLowValues,
          open: chartData.financialChartOpenValues,
          type: 'candlestick',
        },
      ]}
      layout={{
        width: 720,
        height: 440,
        title: `${originalFromName} to ${originalToName} over 30 days`,
        dragmode: 'zoom',
        showlegend: false,
        xaxis: {
          rangeslider: {
            visible: false,
          },
        },
        yaxis: {
          autorange: true,
        },
      }}
    />
  );
};
