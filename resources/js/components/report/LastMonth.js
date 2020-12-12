import React,{useContext,useState, useEffect} from 'react'
import Moment from 'react-moment';
import moment from 'moment';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {ReportContext} from '../ReportContext';

import TradesTable from './TradesTable';
import CalculateTotal from './CalculateTotal';

const useStyles = makeStyles((theme) => ({

}));


function LastMonth() {

  const [trades, setTrades] = useContext(ReportContext);
  const[rows, setRows]=useState([]);

  const lastMonth =moment().startOf('month').subtract(1, 'months');
  
  let rowData =[];
  trades.forEach((trade)=>{
    let same = moment(trade.date).isSame(lastMonth);
    let after =  moment(trade.date).isAfter(lastMonth);
    let before =  moment(trade.date).isBefore(moment().startOf('month'));
    if((same || after) && before){
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
        <h1>Last Month</h1>
      <CalculateTotal rows={rows} />
      <TradesTable rows={rows} />
      </CardContent>
      </Card>
  );
}
export default LastMonth ;