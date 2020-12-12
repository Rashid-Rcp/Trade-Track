import React, {useState,useEffect} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({

    changeGreen:{
        color:'green',
    },
    changeRed:{
        color:'red',
    }

}));

function CalculateTotal(props) {
    const classes = useStyles();
    const trades = props.rows;
    const [total, setTotal]=useState({});
    let totalTrades = 0;
    let totalAmount = 0;
    let currentValue = 0;
    trades.map((trade)=>{
        totalTrades++;
        totalAmount+=Number(trade.price) * Number(trade.quantity);
        currentValue+=Number(trade.ltp) * Number(trade.quantity);
    });
    useEffect(()=>{
        let change =((( Number(currentValue) - Number(totalAmount)) / Number(totalAmount)) * 100).toFixed(2);
        setTotal({trades:totalTrades,amount:totalAmount,value:currentValue,change:change});
    },[trades]);

    return (
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell> Total Trades : {total.trades}</TableCell>
              <TableCell> Amount Used : ₹{total.amount}</TableCell>
              <TableCell> Current Value : ₹{total.value }</TableCell>
              <TableCell>Change : <span className={total.change>=0?classes.changeGreen:classes.changeRed} >{total.change} %</span></TableCell>
              
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
}

export default CalculateTotal;
