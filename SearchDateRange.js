import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IntlMessages from "Util/IntlMessages";
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function SearchDateRange({startDate, endDate, onchange, search}) {
  const classes = useStyles();
  const minDateLimit = moment().subtract(89, 'days').format('YYYY-MM-DD'); // 89 Days
  const todaysDate = moment().format('YYYY-MM-DD');
  return (
    <div className={classes.container}>
      <TextField
        variant="outlined"
        id="date"
        label="Start"
        name="startDate"
        type="date"
        value={startDate}
        onChange={onchange}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: minDateLimit,
          max: endDate || todaysDate
        }}
      />
      <TextField
        variant="outlined"
        id="date"
        label="End"
        type="date"
        value={endDate}
        name="endDate"
        onChange={onchange}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          max: todaysDate,
          min: startDate ? startDate : minDateLimit,
        }}
      />

      <Button
        variant="contained"
        disabled={!(startDate && endDate)}
        size="medium"
        color="primary"
        className="btn-primary"
        style={{ marginLeft: "1rem", width: "100px" }}
        onClick={search}
      >
        <IntlMessages id={"button.search"}/>
      </Button>
    </div>
  );
}