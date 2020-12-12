import React,{useContext,useState, useEffect} from 'react'
import Moment from 'react-moment';
import moment from 'moment';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {ReportContext} from './../ReportContext';

import TradesTable from './TradesTable';
import CalculateTotal from './CalculateTotal';

const useStyles = makeStyles((theme) => ({

}));


function Monthly() {

  const [trades, setTrades] = useContext(ReportContext);
  const[rows, setRows]=useState([]);

  const monthStart =moment().startOf('month');

  let rowData =[];
  trades.forEach((trade)=>{
    if(moment(trade.date).isSame(monthStart) || moment(trade.date).isAfter(monthStart)){
      let change =((( Number(trade.ltp) - Number(trade.price)) / Number(trade.price)) * 100).toFixed(2);
      rowData.push( {...trade,...{'change':change}});
    }
  });
 
  const classes = useStyles();

  useEffect(()=>{
    setRows(rowData);
  },[trades]);

  return (
   <Card variant="outlined">
     <CardContent>
        <h1>This Month</h1>
      <CalculateTotal rows={rows} />
      <TradesTable rows={rows} />
      </CardContent>
      </Card>
  );
}
export default Monthly ;