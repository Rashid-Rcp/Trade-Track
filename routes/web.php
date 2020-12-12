<?php

use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// router of laravel
// Route::get('/', function () {
//     return view('app');
// });

Route::resource('products','ProductController');

Route::view('/trade','test.test');
Route::post('/trade/store','TradeController@store');

Route::view('/{path?}','app');