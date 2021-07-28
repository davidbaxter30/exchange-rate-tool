import { useState, useEffect } from 'react';
import {
  Currency,
  useCurrencyList,
  useExchangeAPI,
} from '@exchange-rate-tool/hooks';
import { ChartData, CurrencyChart } from '@exchange-rate-tool/components';

import {
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  AppBar,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './style';
import { buildChartData } from './utilities/buildChartData';

export const App = () => {
  const [chartData, setChartData] = useState<ChartData>();
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
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

  const toggleSource = () => {
    setToCurrency('');
    setFromCurrency('');
    setIsDigital((prevValue) => !prevValue);
  };

  const buildMenuItem = (currency: Currency) => (
    <MenuItem value={currency.code} key={currency.code}>
      {currency.name}
    </MenuItem>
  );

  useEffect(() => {
    if (history && !(loadingHistory || errorHistory)) {
      setChartData(buildChartData(history));
    }
  }, [errorHistory, history, loadingHistory]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <AppBar position="static" className={classes.appBar}>
          <Typography variant="h6" className={classes.title}>
            Exchange Rate Lookup Tool
          </Typography>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <InputLabel id="fromCurrency">Currency</InputLabel>
          <Select
            labelId="fromCurrency"
            id="selectFromCurrency"
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
          >
            <MenuItem value=""></MenuItem>
            {isDigital
              ? digitalCurrencies.map(buildMenuItem)
              : physicalCurrencies.map(buildMenuItem)}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel id="toCurrency">
            {isDigital ? 'Market' : 'Currency'}
          </InputLabel>
          <Select
            labelId="toCurrency"
            id="selectToCurrency"
            value={toCurrency}
            onChange={handleToCurrencyChange}
          >
            <MenuItem value=""></MenuItem>
            {physicalCurrencies.map((currency) => (
              <MenuItem value={currency.code} key={currency.code}>
                {currency.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
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
      <Grid item xs={12}>
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
              <strong>Current Exchange Rate:</strong> {exchangeRate}
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default App;
