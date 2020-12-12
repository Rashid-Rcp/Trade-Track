import React,{useContext,useState, useEffect} from 'react'

import Moment from 'react-moment';
import moment from 'moment';

import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import {ReportContext} from './../ReportContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 0,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  changeGreen:{
    color:'green',
  },
  changeRed:{
    color:'red',
  }
}));

function descendingComparator(a, b, orderBy) {
 
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {

  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'symbol', numeric: false, disablePadding: false, label: 'Symbol' },
  { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
  { id: 'change', numeric: true, disablePadding: false, label: 'Change' },
  
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


function Weekly() {

  const [trades, setTrades] = useContext(ReportContext);
  const [total, setTotal]= useState({});
  const[rows, setRows]=useState([]);
  const today = moment();
  const weekStart = today.startOf('isoWeek');

  let rowData =[];
  trades.forEach((trade, index, array)=>{
    const today = moment();
    const weekStart = today.startOf('isoWeek');
   
    if(moment(trade.date).isSame(weekStart) || moment(trade.date).isAfter(weekStart)){
      let change =((( Number(trade.ltp) - Number(trade.price)) / Number(trade.price)) * 100).toFixed(2);
      rowData.push( {...trade,...{'change':change}});
    }
  });
 


  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [page, setPage] =useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(()=>{
    calculateTotal();
    setRows(rowData);
  },[trades]);

  function calculateTotal(){
   
    let totalTrades = 0;
    let totalAmount = 0;
    let currentValue = 0;
    trades.map((trade)=>{
      
      if(moment(trade.date).isSame(weekStart) || moment(trade.date).isAfter(weekStart)){
        totalTrades++;
        totalAmount+=Number(trade.price) * Number(trade.quantity);
        currentValue+=Number(trade.ltp) * Number(trade.quantity);
      }
    });
    let change =((( Number(currentValue) - Number(totalAmount)) / Number(totalAmount)) * 100).toFixed(2);
    setTotal({trades:totalTrades,amount:totalAmount,value:currentValue,change:change});
  }
 
  return (
   <Card variant="outlined">
     <CardContent>
        <h1>This Week</h1>

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



        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      key={row.id}
                    >
                      <TableCell component="th" scope="row" padding="none">
                        {row.symbol}
                      </TableCell>
                      <TableCell align="right">{row.date}</TableCell>
                      <TableCell align="right"className={row.change>=0?classes.changeGreen:classes.changeRed}>{row.change} %</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </CardContent>
      </Card>
  );
}
export default Weekly ;