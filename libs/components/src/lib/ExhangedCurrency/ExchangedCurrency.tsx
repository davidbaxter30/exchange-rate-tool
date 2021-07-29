import { Box, Grid } from '@material-ui/core';
import { useState } from 'react';

type PropTypes = {
  amount: number;
  rate: number;
  fromName: string;
  toName: string;
};

export const ExchangedCurrency = ({
  amount,
  rate,
  fromName,
  toName,
}: PropTypes) => {
  const [originalFromName] = useState<string>(fromName);
  const [originalToName] = useState<string>(toName);
  const [originalRate] = useState<number>(rate);

  return (
    <Box>
      <Grid
        justifyContent="center"
        alignItems="center"
        direction="column"
        container
        spacing={3}
      >
        {amount} {originalFromName}={amount * originalRate} {originalToName}
      </Grid>
    </Box>
  );
};
