import { useState, useEffect } from 'react';
import { useCurrencyList, useExchangeAPI } from '@exchange-rate-tool/hooks';
import {
  ChartData,
  CurrencyChart,
  ExchangedCurrency,
} from '@exchange-rate-tool/components';

import {
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  AppBar,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './style';
import { buildChartData } from './utilities/buildChartData';
import LookupForm from './LookupForm/LookupForm';

export const App = () => {
  const [chartData, setChartData] = useState<ChartData>();
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [isDigital, setIsDigital] = useState<boolean>(false);

  const { physicalCurrencies, digitalCurrencies } = useCurrencyList();

  const classes = useStyles();

  const {
    getCurrencyExchangeRate,
    getCurrencyHistory,
    clearSelection,
    exchangeRate,
    history,
    loadingExchangeRate,
    loadingHistory,
    errorHistory,
  } = useExchangeAPI();

  const getExchangeRate = () => {
    clearSelection();
    getCurrencyExchangeRate(fromCurrency, toCurrency);
    getCurrencyHistory(fromCurrency, toCurrency, isDigital);
  };

  const handleFromCurrencyChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    if (
      typeof event?.target.value === 'string' &&
      event?.target.value.length > 0
    ) {
      setFromCurrency(event?.target.value);
    }
  };

  const handleToCurrencyChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    if (
      typeof event?.target.value === 'string' &&
      event?.target.value.length > 0
    ) {
      setToCurrency(event?.target.value);
    }
  };

  const handleAmountChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    if (typeof event?.target.value === 'string') {
      setAmount(parseFloat(event?.target.value));
    }
  };

  const toggleSource = () => {
    setToCurrency('');
    setFromCurrency('');
    setIsDigital((prevValue) => !prevValue);
  };

  useEffect(() => {
    if (history && !(loadingHistory || errorHistory)) {
      setChartData(buildChartData(history));
    }
  }, [errorHistory, history, loadingHistory]);

  const lookupFormProps = {
    fromCurrency,
    toCurrency,
    physicalCurrencies,
    digitalCurrencies,
    isDigital,
    handleFromCurrencyChange,
    handleToCurrencyChange,
    handleAmountChange,
  };

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={3}>
      <Grid item xs={12}>
        <AppBar position="static" className={classes.appBar}>
          <Typography variant="h6" className={classes.title}>
            Exchange Rate Lookup Tool
          </Typography>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        <LookupForm {...lookupFormProps} />
      </Grid>
      <Grid item xs={12}>
        <Grid spacing={3} justifyContent="center" alignItems="center" container>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={getExchangeRate}
            disabled={!toCurrency || !fromCurrency}
          >
            Get Exchange Rate
          </Button>
          <Button variant="contained" color="secondary" onClick={toggleSource}>
            Switch to {isDigital ? 'Fiat' : 'Crypto'}
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        {(loadingHistory || loadingExchangeRate) && <CircularProgress />}
        {errorHistory && (
          <Card>
            <CardHeader title="History Retrieval Error" />
            <CardContent>{errorHistory}</CardContent>
            <CardContent>
              Try again with another country combination.
            </CardContent>
          </Card>
        )}
        {chartData && exchangeRate && !(loadingHistory || loadingExchangeRate) && (
          <Card>
            <CardHeader title="Exchange Rate Information" />
            <CardContent>
              {chartData && (
                <CurrencyChart
                  chartData={chartData}
                  fromName={fromCurrency}
                  toName={toCurrency}
                />
              )}
            </CardContent>
            <CardContent>
              <ExchangedCurrency
                amount={amount}
                rate={parseFloat(exchangeRate)}
                fromName={fromCurrency}
                toName={toCurrency}
              />
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default App;
