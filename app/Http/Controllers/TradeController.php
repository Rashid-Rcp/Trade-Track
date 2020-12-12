<?php

namespace App\Http\Controllers;

use App\Trade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TradeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $trades = DB::table('trades')->where('status', 'active')->orderBy('id', 'desc')->simplePaginate(10);
      
        return json_encode($trades);
    }

     public function trade_closed(){
        $trades = DB::table('trades')->where('status', 'closed')->orderBy('id', 'desc')->simplePaginate(10);
        return json_encode($trades);
     }
    public function getall(){
        $trades = DB::table('trades')->orderBy('id', 'desc')->get();
        return json_encode($trades);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'tradeData.symbol' => 'required',
            'tradeData.price' => 'required',
            'tradeData.quantity' => 'required',
            'tradeData.date' => 'required',
            'tradeData.breakPoint' => 'required',
            'tradeData.ltp' => 'required'
        ]);
        $tradeData=$request->input('tradeData');
        $result = Trade::create($tradeData);
        if($result->exists()){
            return '{"status":"success","tradeId":"'.$result->id.'"}';
        }
        else{
            return '{"status":"failed"}';
        }
     }

    /**
     * Display the specified resource.
     *
     * @param  \App\Trade  $trade
     * @return \Illuminate\Http\Response
     */
    public function show(Trade $trade)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Trade  $trade
     * @return \Illuminate\Http\Response
     */
    public function edit(Trade $trade)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Trade  $trade
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Trade $trade)
    {
        $request->validate([
            'LtpData.tradeId' => 'required',
            'LtpData.ltp' => 'required',
        ]);
        $LtpData=$request->input('LtpData');
        $result = $trade -> where('id', $LtpData['tradeId'])
        ->update(['ltp' => $LtpData['ltp']]);     
       if($result){
        return '{"status":"success"}';
        }
        else{
            return '{"status":"failed"}';
        }
    }


    public function close(Request $request, Trade $trade)
    {
        $request->validate([
            'tradeId' => 'required',
        ]);
        $tradeId=$request->input('tradeId');
        $result = $trade -> where('id',$tradeId )
        ->update(['status' => 'closed']);     
       if($result){
        return '{"status":"success"}';
        }
        else{
            return '{"status":"failed"}';
        }
    }


    public function remove(Request $request, Trade $trade){
        $request->validate([
            'removeData.type' => 'required',
            'removeData.after' => 'required',
            'removeData.before' => 'required',
            'removeData.id' => 'required',
        ]);
        $type = $request->input('removeData.type');
        $result = 0;
        if($type === 'period'){
            $after = $request->input('removeData.after');
            $before = $request->input('removeData.before');
            $result = $trade->whereDate('date', '>=', $after)->whereDate('date', '<', $before)->
                                where('status','closed')->delete();
           
        }
        elseif($type === 'single'){
            $id = $request->input('removeData.id');
            $result = $trade->where('id', $id)->delete();
        }
        elseif($type === 'allTime'){
            $result = $trade->where('status','closed')->delete();
        }
        if($result){
            return '{"status":"success"}' ;
        }
        else{
            return '{"status":"failed"}' ;
        }
       
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Trade  $trade
     * @return \Illuminate\Http\Response
     */
    public function destroy(Trade $trade)
    {
        //
    }
}
