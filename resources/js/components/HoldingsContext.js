import React,{useState, createContext, useEffect} from 'react';

export const HoldingsContext = createContext();

export const HoldingsProvider = (props)=>{
    const [holdings,setHoldings]=useState({data:[],
        next_page_url:'',
        prev_page_url:''});
   
    useEffect(()=>{
        console.log('rendering-context');
        axios.get('http://127.0.0.1:8000/api/apitest')
        .then(res=>{
            //console.log(res.data);
            setHoldings(res.data);
        })
        .catch(function (error) {
          console.log(error);
          
        });
        },[]); // re-rendering for showing latest trade
       
       
    return(
        // <HoldingsContext.Provider value={{'holdings':holdings,'holdingsNewPage':holdingsNewPage,'refreshTable':refreshTable}}>
        //     {props.children}
        // </HoldingsContext.Provider>

        <HoldingsContext.Provider value={[holdings,setHoldings]}>
        {props.children}
        </HoldingsContext.Provider>
    );

}

