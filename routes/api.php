<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/apitest','TradeController@index');
Route::get('/apitest/getall','TradeController@getall');
Route::get('/apitest/trade_closed','TradeController@trade_closed');
Route::post('/apitest','TradeController@store');
Route::post('/apitest/update_ltp','TradeController@update');
Route::post('/apitest/close_trade','TradeController@close');
Route::post('/apitest/remove_trade','TradeController@remove');
