import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

import {HoldingsContext} from './HoldingsContext'


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  holdings:{
      marginTop:'30px',
      border:'1px solid #ccc',
  },
  breakpoints:{
    marginTop:'30px',
  },
  submitHolder:{
    marginTop:'30px',
  },
  breakPointItem:{
    display:'inline-block',
    padding:'0px 8px',
    marginRight:'5px',
    marginTop:'10px',
    borderRadius:'5px',
  },
  breakPointGreen:{
    backgroundColor:'#7ed77e',
  },
  breakPointRed:{
    backgroundColor:'#fcb7b7',
  },
  loader:{
    width:'25px!important',
    height:'25px!important',
  },
  success:{
    backgroundColor:'green',
    color:'white',
    padding:'10px',
    width:'fit-content',
    position:'absolute',
    borderRadius:'5px',
  },
  error:{
    backgroundColor:'red',
    color:'white',
    padding:'10px',
    width:'fit-content',
    position:'absolute',
    borderRadius:'5px',
  }
}));


export default function Holdings() {

  
  const classes = useStyles();
  const [breakPoint, setBreakPoint] = useState([-3,-2,-1,1,2,3]);
  const [newPoint, setNewPoint]=useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [amount, setAmount]=useState('');
  const [quantity, setQuantity] = useState();
  const [price, setPrice]= useState();
  const [symbol, setSymbol]= useState('');
  const [isError, setIsError]= useState({});
  const [btnSubmit, setBtnSubmit] =useState(false);
  const [actionStatus,setActionStatus]=useState({});

  const[tradeDataCollection,setTradeDataCollection]=useContext(HoldingsContext);
  
  useEffect(()=>{
   console.log('render-holdings')
    },[]); 
  
  function createBreakpoints(){
    if(newPoint){
      const break_point = [...breakPoint,newPoint];
      break_point.sort(function(a,b) { return a - b;});
      //avoid duplication
      setBreakPoint( [...new Set(break_point)] );
      setNewPoint('');
    }
  }
   function removeBreakPoint(index){
     //console.log(e.currentTarget.getAttribute("breakpoint"));
     console.log(index);
     const breakpoint= [...breakPoint];
     breakpoint.splice(index,1);
     console.log(breakpoint);
     setBreakPoint(breakpoint);
     console.log('removed');
   }

   function validate_setPrice(e){
      const price =Number(e.target.value);
      const error = {...isError};
      if(price <= 0 ){
        error.priceError=true;
      }
      else{
        error.priceError=false;
      }
      setIsError(error);
      setPrice(price);
      calculateAmount(price,quantity);
   }

   function validate_setQuantity(e){
    const quantity = Number(e.target.value);
    const error = {...isError};
    if(quantity <= 0 || !Number.isInteger(quantity) ){
      error.quantityError=true;
    }
    else{
      error.quantityError=false;
    }
    setIsError(error);
    setQuantity(quantity);
    calculateAmount(price,quantity);
 }

 function calculateAmount(price,quantity){
   if ((!isError.priceError || !isError.quantityError) && (price && quantity)){
     setAmount(()=>{
      return price * quantity
     });
     //calculate break points
   }
   else {
    setAmount('');
   }
 }

 function handleTradeCreate(e){
  e.preventDefault();
   setBtnSubmit(true);
    console.log('form submission');
    const tradeData = {
      'symbol' : symbol,
      'price': price.toString(),
      'quantity': quantity.toString(),
      'date': startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate(),
      'breakPoint': JSON.stringify(breakPoint),
      'ltp':price.toString()
    }
    axios.post('http://127.0.0.1:8000/api/apitest',{tradeData})
    .then(res=>{
      setBtnSubmit(false);
      const status = res.data;
      console.log(res.data);
      if(status.status ==='success'){
        setActionStatus({type:'success',message:'Trade Added'});
        //update holdings context
        let latestTrade = {id:status.tradeId,...tradeData}
        let newTradeDataCollection = {...tradeDataCollection};
        newTradeDataCollection.data.unshift(latestTrade);
        setTradeDataCollection(newTradeDataCollection);
      }
      else{
        setActionStatus({type:'error',message:'An Error Occurred'});
      }
      setTimeout(function(){ setActionStatus({}) }, 3000);
    })
    .catch(function (error) {
      console.log(error);
      setActionStatus({type:'error',message:'An Error Occurred'});
      setTimeout(function(){ setActionStatus({}) }, 3000);
    });
 }



  return (
    <div className={classes.holdings}>
      <form onSubmit={handleTradeCreate}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
           
            <div>
                <TextField required label="Symbol" value={symbol} onChange={e=>setSymbol(e.target.value.toUpperCase())}  />
                <TextField required type="number"  inputProps={{ min: "1" }} label="Price" value={price?price:''} onChange={validate_setPrice}  {...(isError.priceError && {error: true, helperText:'invalid price'})}/>
                {/* <TextField required type="number"  inputProps={{ min: "1"}} label="Quantity" value={quantity} onChange={e=>setQuantity(e.target.value)}  {...(isError.quantityError && {error: true, helperText:'invalid quantity'})}/> */}
                <TextField required type="number"  inputProps={{ min: "1"}} label="Quantity" value={quantity?quantity:''} onChange={validate_setQuantity}  {...(isError.quantityError && {error: true, helperText:'invalid quantity'})}/>
                <TextField label="Amount"
                    InputProps={{
                      readOnly: true,
                    }} 
                   value ={amount?amount:''}
                /> 
                {symbol} / {price}  / {quantity} / {amount} 
            </div>
        
        </Grid>
        <Grid item xs={6}>
            <div className={classes.breakpoints}>
                <Typography variant="h5">Break Point (price)</Typography>
                <TextField type="number" value={newPoint} onChange={e => setNewPoint(e.target.value)} label="break point at -- %"/>
                <Button onClick={createBreakpoints} variant="contained">Create</Button>

                <div>{breakPoint.map((breakpoint,index)=>(
                  <Typography className={`${classes.breakPointItem} ${Number(breakpoint)<0 ? classes.breakPointRed:classes.breakPointGreen}`} key={index}>{breakpoint}% = {((Number(breakpoint)/100 * Number(price)) + (Number(price))).toFixed(2)} 
                    <IconButton aria-label="delete" breakpoint={breakpoint} onClick={()=>removeBreakPoint(index)} >
                        <DeleteIcon />
                    </IconButton>
                    {/* <IconButton aria-label="delete"  breakpoint={breakpoint} onClick={removeBreakPoint} >
                        <DeleteIcon />
                    </IconButton> */}
                  </Typography>
                ))}</div>
            </div>
        </Grid>

        <Grid item xs={6}>
          <div>
                <Typography variant="h5">Date</Typography>
                <DatePicker required selected={startDate} onChange={date=>setStartDate(date)} 
                dateFormat="dd/MM/yyyy" maxDate = {new Date()}
                />
          </div>
          <div>   
          </div>
        </Grid>
        <Grid item xs={12} className={classes.submitHolder}>
          <Button disabled={btnSubmit} className={classes.submitButton} variant="contained" type="submit">Submit</Button>
          {btnSubmit?<CircularProgress   className={classes.loader} />:''}  
          {actionStatus?<div className={classes[actionStatus.type]}>{actionStatus.message}</div>:''}
        </Grid>
      </Grid>
      </form>
    </div>
  );
}
