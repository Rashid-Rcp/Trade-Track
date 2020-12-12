import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import axios from 'axios';

import {HoldingsContext} from './HoldingsContext'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';


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
  },
  buttonProgress: {
    color: 'green',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    width: 'fit-content',
    margin: 'auto 0 auto auto',
    position: 'relative',
  },
}));

export default function holdingsTable() {

  const classes = useStyles();
  const [actionStatus,setActionStatus]=useState({type:'info',message:'',show:false});
  const[tradeDataCollection,setTradeDataCollection]=useContext(HoldingsContext);
  const [closeTradeWarning, setCloseTradeWarning] = useState(false);
  const[closeTradeData, setCloseTradeData]=useState({symbol:'',ltp:'',id:''});
  const [loadingTrade,setLoadingTrade]=useState(false);


  const handleClose = () => {
    setCloseTradeWarning(false);
  };

  useEffect(()=>{
   console.log('render-holdingsTable');
    },[]); 

    function prevTrade(){
      if(tradeDataCollection.prev_page_url){
        setLoadingTrade(true);
        axios.get(tradeDataCollection.prev_page_url)
        .then(res=>{
            setTradeDataCollection(res.data);
            setLoadingTrade(false);
        })
        .catch(function (error) {
          setLoadingTrade(false);
          console.log(error);
        });
      }
    }

    function nextTrade(){
     if(tradeDataCollection.next_page_url){
      setLoadingTrade(true);
      axios.get(tradeDataCollection.next_page_url)
      .then(res=>{
        setLoadingTrade(false);
          setTradeDataCollection(res.data);
      })
      .catch(function (error) {
        setLoadingTrade(false);
        console.log(error);
        
      });
    }
   }

 function updateLTP(value,tradeId){

 let newDataCollection ={...tradeDataCollection};

 tradeDataCollection.data.forEach((trade,index)=>{
  if(trade.id === tradeId){
    newDataCollection.data[index].ltp= {'value':value,'status':'waiting'};
    setTradeDataCollection(newDataCollection);
    return;
  }
 });

 }

 function saveLTP(tradeId){
   //save to db
   let theLTP =0
   tradeDataCollection.data.forEach((trade,index)=>{
     if(trade.id === tradeId){
      theLTP = tradeDataCollection.data[index].ltp;
      if(typeof trade.ltp === 'object' && trade.ltp !== null){
        theLTP = trade.ltp.value;
      }
     }
   });

   const LtpData={ 'tradeId':tradeId,'ltp':theLTP}
   
   axios.post('http://127.0.0.1:8000/api/apitest/update_ltp',{LtpData})
    .then(res=>{
      const status = res.data;
      if(status.status ==='success'){
        setActionStatus({type:'success',message:'LTP Updated',show:true});

        //Change LTP object
        let newDataCollection ={...tradeDataCollection};
        tradeDataCollection.data.forEach((trade,index)=>{
         if(trade.id === tradeId){
           newDataCollection.data[index].ltp= theLTP;
           setTradeDataCollection(newDataCollection);
           return;
         }
        });
      }
      else{
        setActionStatus({type:'error',message:'An Error Occurred',show:true});
      }
     // setTimeout(function(){ setActionStatus({type:'',message:'',show:false}) }, 3000);
    })
    .catch(function (error) {
      console.log(error);
      setActionStatus({type:'error',message:'An Error Occurred',show:true});
     // setTimeout(function(){ setActionStatus({type:'',message:'',show:false}) }, 3000);
    });
   
 }

 function closeTrade(tradeId){
   setCloseTradeWarning(true);
   tradeDataCollection.data.forEach((trade)=>{
     if(trade.id===tradeId){
       setCloseTradeData({symbol:trade.symbol,ltp:trade.ltp,id:trade.id});
       return;
     }
   });
 }

 function tradeCloseConfirm(tradeId){
   axios.post('http://127.0.0.1:8000/api/apitest/close_trade',{tradeId})
    .then(res=>{
      const status = res.data;
      console.log(status);
      if(status.status ==='success'){
        handleClose();
        setActionStatus({type:'success',message:'Trade closed',show:true});
        //update table list of trades
        let newTradeDataCollection = {...tradeDataCollection};
        tradeDataCollection.data.forEach((trade,index)=>{
          if(trade.id === tradeId){
            delete newTradeDataCollection.data[index];
            return;
          }
        });
        setTradeDataCollection(newTradeDataCollection);
      }
      else{
        setActionStatus({type:'error',message:'An Error Occurred',show:true});
      }
    })
    .catch(function (error) {
      console.log(error);
      setActionStatus({type:'error',message:'An Error Occurred',show:true});
    });
 }

 function closeActionStatus(){
  setActionStatus({type:'info',message:'',show:false});
 }

  return (
    <div className={classes.holdings}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="trade table">
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Break points (price)</TableCell>
                    <TableCell align="right">Duration</TableCell>
                    <TableCell align="right">LTP</TableCell>
                    <TableCell align="right">Change</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { tradeDataCollection.data.map((trade) => {

                    const breakPoint =JSON.parse( trade.breakPoint);
                    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    const tradeDate = new Date(trade.date);
                    const currentDate = new Date();
                    const diffDays = Math.round(Math.abs((tradeDate - currentDate) / oneDay));
                   
                    let ltp = trade.ltp;
                    let toSave = false;
                    if(typeof trade.ltp === 'object' && trade.ltp !== null){
                      ltp = trade.ltp.value;
                      toSave = true;
                    }

                    let change =((( Number(ltp) - Number(trade.price)) / Number(trade.price)) * 100).toFixed(2);

                      return (
                        <TableRow key={trade.id}>
                        <TableCell component="th" scope="row">
                         <p><strong>{trade.symbol}</strong></p>{trade.date}
                        </TableCell>
                        <TableCell align="right">{trade.quantity}</TableCell>
                        <TableCell align="right">{trade.price}</TableCell>
                        <TableCell align="right">{Number(trade.quantity) * Number(trade.price)}</TableCell>
                        <TableCell align="center">{
                        breakPoint.map((point,index)=>{
                        let value = ((Number(point)/100 * Number(trade.price)) + (Number(trade.price))).toFixed(2);
                          return(
                          <span className={`${classes.breakPointItem} ${Number(point)<0 ? classes.breakPointRed:classes.breakPointGreen}`}  key={index}>{point}%={value}</span>
                        )})
                        }</TableCell>
                        <TableCell align="right">{diffDays} Days</TableCell>
                        <TableCell align="right"><input type="text" value={ltp}  onChange={e => updateLTP(e.target.value,trade.id) } />
                        {
                        toSave ?<Button variant="contained" color="primary" size="small" className={classes.button} startIcon={<SaveIcon />} onClick={()=>saveLTP(trade.id)}>Save</Button>:''
                        }
                        
                        </TableCell>
                        <TableCell align="right">
                         
                          {/* compare price and ltp , show th amount with respect to ltp */}
                          {
                            change >= 0 ?<span style={{color:'green'}}>{change}%</span>:<span style={{color:'red'}}>{change}%</span>
                            
                          }
                          <p>Amount : {Number(ltp)*Number(trade.quantity)}</p>
                          
                        </TableCell>

                        <TableCell align="right">
                          <Button onClick={()=>closeTrade(trade.id)}>Close</Button>
                         
                        </TableCell>
                      </TableRow>
                      )
                    })}
                  <TableRow>
                    <TableCell align="right" colSpan={7}>
                      <div className={classes.wrapper}>
                         <Button disabled={(tradeDataCollection.prev_page_url?false:true) || (loadingTrade?true:false)} onClick={prevTrade}>Prev</Button>
                         <Button disabled={(tradeDataCollection.next_page_url?false:true) || (loadingTrade?true:false)} onClick={nextTrade}>Next</Button>
                        {loadingTrade && <CircularProgress size={24} className={classes.buttonProgress} />} 
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
        </Grid>
      </Grid>

      <Dialog
        open={closeTradeWarning}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm LTP before Close!"}</DialogTitle>
        <DialogContent>
                  <h1>STOCK : {closeTradeData.symbol}</h1>
                  <h1>LTP : {closeTradeData.ltp}</h1>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={()=>{tradeCloseConfirm(closeTradeData.id)}} color="primary" autoFocus>
            Confirm & Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar  anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }} open={actionStatus.show} autoHideDuration={5000} onClose={closeActionStatus}>
        <MuiAlert onClose={closeActionStatus} severity={actionStatus.type}>
         {actionStatus.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
