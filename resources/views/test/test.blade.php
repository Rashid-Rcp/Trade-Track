@extends('products.layout')
  
@section('content')
<div class="row">
    <div class="col-lg-12 margin-tb">
        <div class="pull-left">
            <h2>Add New Product</h2>
        </div>
        <div class="pull-right">
            <a class="btn btn-primary" href="{{ route('products.index') }}"> Back</a>
        </div>
    </div>
</div>
   
@if ($errors->any())
    <div class="alert alert-danger">
        <strong>Whoops!</strong> There were some problems with your input.<br><br>
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
   
<form action="{{url('trade/store')}}" method="POST">
    @csrf
  
     <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="form-group">
                <strong>TRADE:</strong>
                <input type="text" name="symbol" value="wipro" class="form-control" placeholder="Name">
                <input type="text" name="price" value="300" class="form-control" placeholder="Name">
                <input type="text" name="quantity" value="1" class="form-control" placeholder="Name">
                <input type="text" name="date" value="2020-10-07T04:51:40.960Z" class="form-control" placeholder="Name">
                <input type="text" name="breakPoint" value="1" class="form-control" placeholder="Name">
                {{-- <input type="text" name="breakPoint" value="2" class="form-control" placeholder="Name">
                <input type="text" name="breakPoint" value="3" class="form-control" placeholder="Name">
                <input type="text" name="breakPoint" value="4" class="form-control" placeholder="Name"> --}}
            </div>
        </div>
        
        <div class="col-xs-12 col-sm-12 col-md-12 text-center">
                <button type="submit" class="btn btn-primary">Submit</button>
        </div>
    </div>
   
</form>
@endsection