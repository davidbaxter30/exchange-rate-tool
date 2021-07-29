import { Currency } from '@exchange-rate-tool/hooks';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from '@material-ui/core';
import { useStyles } from './style';

type Props = {
  fromCurrency: string;
  toCurrency: string;
  digitalCurrencies: Currency[];
  physicalCurrencies: Currency[];
  isDigital: boolean;
  handleFromCurrencyChange: (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => void;
  handleToCurrencyChange: (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => void;
  handleAmountChange: (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => void;
};

export const LookupForm = ({
  fromCurrency,
  toCurrency,
  isDigital,
  digitalCurrencies,
  physicalCurrencies,
  handleFromCurrencyChange,
  handleToCurrencyChange,
  handleAmountChange,
}: Props) => {
  const classes = useStyles();

  const buildMenuItem = (currency: Currency) => (
    <MenuItem value={currency.code} key={currency.code}>
      {currency.name}
    </MenuItem>
  );

  return (
    <Grid spacing={3} justifyContent="center" alignItems="center" container>
      <Box className={classes.text}>Exchange</Box>

      <FormControl className={classes.formControl}>
        <TextField id="amount" label="Amount" onChange={handleAmountChange} />
      </FormControl>

      <Box className={classes.text}>in</Box>

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

      <Box className={classes.text}>for</Box>

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
  );
};

export default LookupForm;
