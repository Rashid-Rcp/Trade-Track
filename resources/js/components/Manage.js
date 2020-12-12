import React,{useState,useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

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

import moment from 'moment';
import axios from 'axios';
const useStyles = makeStyles({
    title:{
        textAlign:'center',
        width:'100%',
        marginTop:'50px',
        marginBottom:'50px',
    },
    tradeTable:{
      marginTop:'60px',
    }
  });

function Manage() {
    const classes = useStyles();
    const[askConfirmation,setAskConfirmation] = useState(false);
    const[deleteType, setDeleteType] = useState('');
    const [actionStatus,setActionStatus]=useState({type:'info',message:'',show:false});
    const [tradeDataCollection,setTradeDataCollection]=useState({data:[],
      next_page_url:'',
      prev_page_url:''});
    
    const [refreshTrade,setRefreshTrade] = useState(0);

    const [loadingTrade,setLoadingTrade]=useState(false);

    useEffect(()=>{
      axios.get('http://127.0.0.1:8000/api/apitest/trade_closed')
        .then(res=>{
        
          setTradeDataCollection(res.data);
        })
        .catch(function (error) {
          console.log(error);
         
        });
    },[refreshTrade])

    function removeTrades(){
       
        const actionType = deleteType;
        setAskConfirmation(false);
        setDeleteType('');
        let afterDate = '0';
        let beforeDate = '0';
        let id = 0;
        let type = 'period';
        if(actionType ==='lastWeek'){
          afterDate = moment().startOf('isoWeek').subtract(7, 'days').format('YYYY-MM-DD').toString();
          beforeDate = moment().startOf('isoWeek').format('YYYY-MM-DD').toString();
        }
        else if(actionType === 'lastMonth'){
           afterDate = moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD').toString();
           beforeDate = moment().startOf('month').format('YYYY-MM-DD').toString();
        }
        else if(actionType === 'allTime'){
          type = 'allTime';
        }
        else{
          id = actionType;
          type = 'single';
        }
        const removeData = {
            'type':type,
            'after':afterDate,
            'before':beforeDate,
            'id':id,
        }
       
        axios.post('http://127.0.0.1:8000/api/apitest/remove_trade',{removeData})
        .then(res=>{
          const status = res.data;
          if(status.status === 'success'){
            setRefreshTrade(refreshTrade + 1);
            setActionStatus({type:'success',message:'Trades Removed',show:true});
            // success alert
          }
          else{
            setActionStatus({type:'error',message:'No Data Found',show:true});
            // failure alert 
          }
         
        })
        .catch(function (error) {
          console.log(error);
         
        });
    
    }

    function handleClose(){
      setAskConfirmation(false);
      setDeleteType('');
    }

    function tradeRemoveWarning(type){
      setAskConfirmation(true);
      setDeleteType(type);
    }
   function closeActionStatus(){
     setActionStatus({type:'info',message:'',show:false});
   }
    
   
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
    return (
        <div>
            <Typography className={classes.title} variant="h3" gutterBottom>
                Manage
            </Typography>

             <Card variant="outlined">
                <CardContent>
                     <Typography>
                        Remove Closed Trades of last week.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={()=>{tradeRemoveWarning('lastWeek')}} size="small">Remove</Button>
                </CardActions>
            </Card>
            <Card variant="outlined">
                <CardContent>
                     <Typography>
                        Remove Closed Trades of last month.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={()=>{tradeRemoveWarning('lastMonth')}} size="small">Remove</Button>
                </CardActions>
            </Card>
            <Card variant="outlined">
                <CardContent>
                     <Typography>
                        Remove Closed Trades of all time.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={()=>{tradeRemoveWarning('allTime')}} size="small">Remove</Button>
                </CardActions>
            </Card>

      <Grid container spacing={1} className={classes.tradeTable}>
        <Grid item xs={12}>
        <Typography className={classes.title} variant="h5" gutterBottom>
                Closed Trades
          </Typography>
          <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="trade table">
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">LTP</TableCell>
                    <TableCell align="right">Change</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { tradeDataCollection.data.map((trade) => {


                    let change =((( Number(trade.ltp) - Number(trade.price)) / Number(trade.price)) * 100).toFixed(2);

                      return (
                        <TableRow key={trade.id}>
                        <TableCell component="th" scope="row">
                         <p><strong>{trade.symbol}</strong></p>{trade.date}
                        </TableCell>
                        <TableCell align="right">{trade.quantity}</TableCell>
                        <TableCell align="right">{trade.price}</TableCell>
                        <TableCell align="right">{Number(trade.price)*Number(trade.quantity)}</TableCell>
                       
                        <TableCell align="right">{trade.ltp}</TableCell>
                        
                        <TableCell align="right">
                         
                          {/* compare price and ltp , show th amount with respect to ltp */}
                          {
                            change >= 0 ?<span style={{color:'green'}}>{change}%</span>:<span style={{color:'red'}}>{change}%</span>
                            
                          }
                          <p>Amount : {Number(trade.ltp)*Number(trade.quantity)}</p>
                          
                        </TableCell>

                        <TableCell align="right">
                          <Button onClick={()=>tradeRemoveWarning(trade.id)}>remove</Button>
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
              open={askConfirmation}
              onClose={handleClose}
            >
              <DialogTitle id="alert-dialog-title">{"Confirm Your Action!"}</DialogTitle>
              <DialogContent>
                <h1>Delete Closed Trades of {Number.isInteger(deleteType)?'item':deleteType}?</h1>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={removeTrades} color="primary" autoFocus>
                 Delete
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
    )
}

export default Manage;
