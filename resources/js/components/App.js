import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Holdings from './Holdings';
import HoldingsTable from './HoldingsTable';
import Report from './Report';
import Manage from './Manage';
import {HoldingsProvider} from './HoldingsContext';
import {ReportProvider} from './ReportContext';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
function App() { 
    
    return (
        
        <Router>  
            <Header/>
            
                <Switch>
                    <Route path ="/" exact >
                        <HoldingsProvider>
                            <Holdings/>
                            <HoldingsTable/>
                        </HoldingsProvider>
                    </Route>
                    <Route path ="/report" exact>
                        <ReportProvider>
                            <Report/>
                        </ReportProvider>
                    </Route>
                    <Route path ="/manage" exact component={Manage} />
                </Switch>
           
        </Router>
       
    );
}


export default App;

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
