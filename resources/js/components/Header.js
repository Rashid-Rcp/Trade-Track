import React,{useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from 'react-router-dom';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({

  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  navLink:{
    '& li':{
      display:'inline-block',
      padding:'0px 15px',
    },
    '& li a':{
      color:'white',
      textDecoration:'none',
    }
  }
}));

export default function Header() {
  const classes = useStyles();

    
  useEffect(()=>{
    console.log('rendering-header');
    });

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Trade Track
          </Typography>
          <ul className={classes.navLink}>
            <li><Link to="/"> <Button color="inherit">HOLDINGS</Button></Link></li>
            <li><Link to="/report"> <Button color="inherit">REPORT</Button></Link></li>
            <li><Link to="/manage"> <Button color="inherit">MANAGE</Button></Link></li>
          </ul>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
