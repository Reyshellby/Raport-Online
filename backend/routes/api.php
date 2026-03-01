<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AcademicYear;
use App\Http\Controllers\ClassesController;
use App\Http\Controllers\MajorController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeachingAssignment;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'guard:admins'])->group(function () {
    Route::middleware(['role:superAdmin'])->group(function () {

    });
});

Route::middleware(['auth:sanctum', 'guard:teachers'])->group(function () {});

Route::middleware(['auth:sanctum', 'guard:students'])->group(function () {});
