<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MajorController;
use App\Http\Controllers\ClassesController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//major
Route::get('/major', [MajorController::class, 'index']);
Route::get('/major/{major}', [MajorController::class, 'show']);
Route::post('/major', [MajorController::class, 'store']);
Route::put('/major/{id}', [MajorController::class, 'update']);
Route::delete('/major/{id}', [MajorController::class, 'destroy']);

//classes
Route::get('/classes', [ClassesController::class, 'index']);
Route::post('/classes', [ClassesController::class, 'store']);
Route::put('/classes/{id}', [ClassesController::class, 'update']);
Route::delete('/classes/{id}', [ClassesController::class, 'destroy']);