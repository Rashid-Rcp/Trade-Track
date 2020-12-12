import React,{useState, createContext, useEffect} from 'react';

export const ReportContext = createContext();

export const ReportProvider = (props)=>{
    const [trades,setTrades]=useState([]);
   
    useEffect(()=>{
        console.log('rendering-context Report');
        axios.get('http://127.0.0.1:8000/api/apitest/getall')
        .then(res=>{
            //console.log(res.data);
            setTrades(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
        },[]); // re-rendering for showing latest trade
       
    return(
    
        <ReportContext.Provider value={[trades,setTrades]}>
        {props.children}
        </ReportContext.Provider>
    );

}

