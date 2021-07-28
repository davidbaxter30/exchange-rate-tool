import { TimeSeriesFXDaily } from '@exchange-rate-tool/hooks';

export const buildChartData = (exchangeRateHistory: TimeSeriesFXDaily) => {
  const financialChartXValuesFunction = [];
  const financialChartCloseValuesFunction = [];
  const financialChartOpenValuesFunction = [];
  const financialChartHighValuesFunction = [];
  const financialChartLowValuesFunction = [];

  for (const key in exchangeRateHistory) {
    if (financialChartXValuesFunction.length === 30) break;

    financialChartXValuesFunction.push(key);
    financialChartCloseValuesFunction.push(
      parseFloat(exchangeRateHistory[key]['4. close'])
    );
    financialChartOpenValuesFunction.push(
      parseFloat(exchangeRateHistory[key]['1. open'])
    );
    financialChartHighValuesFunction.push(
      parseFloat(exchangeRateHistory[key]['2. high'])
    );
    financialChartLowValuesFunction.push(
      parseFloat(exchangeRateHistory[key]['3. low'])
    );
  }

  return {
    financialChartXValues: financialChartXValuesFunction,
    financialChartCloseValues: financialChartCloseValuesFunction,
    financialChartOpenValues: financialChartOpenValuesFunction,
    financialChartHighValues: financialChartHighValuesFunction,
    financialChartLowValues: financialChartLowValuesFunction,
  };
};
