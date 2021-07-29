import axios from 'axios';
import { useCallback, useState } from 'react';
import { ExchangeRateResponse } from './ExchangeRateResponse';
import { HistoryResponse, TimeSeriesFXDaily } from './HistoryResponse';

const APIKey = 'N2HOFKFBAH1UFJST';

export const useExchangeAPI = () => {
  const [exchangeRate, setExchangeRate] = useState<string>('');
  const [history, setHistory] = useState<TimeSeriesFXDaily | null>(null);
  const [errorExchangeRate, setErrorExchangeRate] = useState<string | null>(
    null
  );
  const [loadingExchangeRate, setLoadingExchangeRate] =
    useState<boolean>(false);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  const clearSelection = () => {
    setExchangeRate('');
    setHistory(null);
    setErrorHistory(null);
    setErrorExchangeRate(null);
  };

  const getCurrencyExchangeRate = useCallback(
    async (fromCurrency: string, toCurrency: string) => {
      setLoadingExchangeRate(true);

      const APIUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${APIKey}`;

      await axios
        .get<ExchangeRateResponse>(APIUrl)
        .then((response) => {
          console.log('getCurrencyExchangeRate', response.data);

          setExchangeRate(
            response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']
          );
        })
        .catch((error) => {
          setErrorExchangeRate(error);
        });

      setLoadingExchangeRate(false);
    },
    []
  );

  const getCurrencyHistory = useCallback(
    async (fromCurrency: string, toCurrency: string, isDigital?: boolean) => {
      setLoadingHistory(true);

      const APIUrl = `https://www.alphavantage.co/query?function=${
        isDigital ? 'DIGITAL_CURRENCY_DAILY' : 'FX_DAILY'
      }&${isDigital ? 'symbol' : 'from_symbol'}=${fromCurrency}&${
        isDigital ? 'market' : 'to_symbol'
      }=${toCurrency}&apikey=${APIKey}`;

      await axios
        .get<HistoryResponse>(APIUrl)
        .then((response) => {
          console.log('getCurrencyHistory', response.data);

          if (response.data['Error Message']) {
            setErrorHistory(response.data['Error Message']);
          } else {
            setHistory(response.data['Time Series FX (Daily)']);
          }
        })
        .catch((error) => {
          setErrorHistory(error);
        });

      setLoadingHistory(false);
    },
    []
  );

  return {
    getCurrencyExchangeRate,
    getCurrencyHistory,
    clearSelection,
    exchangeRate,
    history,
    errorExchangeRate,
    errorHistory,
    loadingExchangeRate,
    loadingHistory,
  };
};
