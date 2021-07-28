export type HistoryResponse = {
  'Meta Data': MetaData;
  'Time Series FX (Daily)': TimeSeriesFXDaily;
  'Error Message'?: string;
};

export type TimeSeriesFXDaily = {
  [date: string]: DayInfo;
};

type DayInfo = {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
};

type MetaData = {
  '1. Information': string;
  '2. From Symbol': string;
  '3. To Symbol': string;
  '4. Output Size': string;
  '5. Last Refreshed': string;
  '6. Time Zone': string;
};
