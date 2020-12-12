import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {ReportContext} from './ReportContext';
import Monthly from './report/Monthly';
import Weekly from './report/Weekly';
import LastWeek from './report/LastWeek';
import LastMonth from './report/LastMonth';
// import EnhancedTable from './report/EnhancedTable';

const useStyles = makeStyles((theme) => ({
  heading :{
    textAlign:'center',
    width:'100%',
  },
  red:{
    color:'red',
    fontSize:'20px',
  },
  green:{
    color:'green',
    fontSize:'20px',
  },
  card:{
    backgroundColor:'#f8f8f8',
  },
  cardActive:{
    
  }

}));


export default function Report() {

  const classes = useStyles();
  const [trades, setTrades] = useContext(ReportContext);
  const [total, setTotal]= useState({});


  useEffect(()=>{
    calculateTotal();
  },[trades]);

  function calculateTotal(){
    let totalTrades = 0;
    let totalAmount = 0;
    let currentValue = 0;
    trades.map((trade)=>{
      if(trade.status ==='active'){
        totalTrades++;
        totalAmount += Number(trade.price) * Number(trade.quantity);
        currentValue += Number(trade.ltp) * Number(trade.quantity);
      }
    });
    let change =((( Number(currentValue) - Number(totalAmount)) / Number(totalAmount)) * 100).toFixed(2);
    setTotal({trades:totalTrades,amount:totalAmount,value:currentValue,change:change});
  }


  
  return (
    <div>
    <Grid container spacing={1}>
       <h1 className={classes.heading}> REPORT </h1>
        <Grid item xs={6}>
          <Card className={`${classes.card} ${classes.cardActive}`} variant="outlined">
          <CardContent>   
              <h3>ACTIVE</h3>
              <h4>Total Trades : {total.trades}</h4>
              <h4>Used Amount : ₹{total.amount}</h4>
              <h4>Current Value: ₹{total.value}</h4>
              <h4>Change : <span  className={total.change>=0?classes.green:classes.red}> {total.change}%</span> </h4>
          </CardContent>
          </Card>
        </Grid>
    </Grid>

    <Grid container spacing={1}>
      <Grid item xs={6}>
      <Weekly/>
        </Grid>
      <Grid item xs={6}>
        <LastWeek/>
      </Grid>
      <Grid item xs={6}>
        <Monthly/>
      </Grid>
      <Grid item xs={6}>
        <LastMonth/>
      </Grid>
        
    </Grid>
    </div>
  );
}
