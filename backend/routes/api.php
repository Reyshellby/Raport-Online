<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AcademicYear;
use App\Http\Controllers\AuthController;
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

Route::post('admin/login', [AuthController::class, 'loginAdmin']);
Route::post('teacher/login', [TeacherController::class, 'loginTeacher']);
Route::post('student/login', [StudentController::class, 'loginStudent']);

Route::middleware(['auth:sanctum', 'guard:admins', 'role:admins,admin'])->group(function () {
    Route::get('/admin/getAllAdmin', [AuthController::class, 'getAllAdmin']);
    Route::put('/admin/updateCredentialAdmin/{id}', [AuthController::class, 'updateCredentialAdmin']);
    Route::delete('/admin/destroy/{id}', [AuthController::class, 'destroy']);
    Route::post('/admin/register', [AuthController::class, 'registerAdmin']);
    Route::post('/admin/logout', [AuthController::class, 'logoutAdmin']);

    Route::get('/admin/getAllTeacher', [TeacherController::class, 'getAllTeacher']);
    Route::post('/admin/registerTeacher', [TeacherController::class, 'registerTeacher']);
    Route::delete('/admin/destroyTeacher', [TeacherController::class, 'destroyTeacher']);

    Route::get('/admin/getAllStudent', [StudentController::class, 'getAllStudent']);
    Route::get('/admin/showStudent', [StudentController::class, 'showStudent']);
    Route::post('/admin/registerStudent', [StudentController::class, 'registerStudent']);
    Route::delete('/admin/destroyStudent', [StudentController::class, 'destroyStudent']);

    Route::get('/admin/getAllAcademicYear', [AcademicYear::class, 'getAllAcademicYear']);
    Route::post('/admin/createAcademicYear', [AcademicYear::class, 'createAcademicYear']);
    Route::get('/admin/showAcademicYear/{academic_year}', [AcademicYear::class, 'showAcademicYear']);
    Route::put('/admin/updateStatusAcademicYear/{id}', [AcademicYear::class, 'updateStatusAcademicYear']);
    Route::delete('/admin/destroyAcademicYear/{id}', [AcademicYear::class, 'destroyAcademicYear']);

    Route::get('/admin/getAllClasses', [ClassesController::class, 'getAllClasses']);
    Route::post('/admin/createClasses', [ClassesController::class, 'createClasses']);
    Route::get('/admin/showClasses/{classes}', [ClassesController::class, 'showClasses']);
    Route::put('/admin/updateClasses/{id}', [ClassesController::class, 'updateClasses']);
    Route::delete('/admin/destroyClasses/{id}', [ClassesController::class, 'destroyClasses']);

    Route::get('/admin/getAllMajor', [MajorController::class, 'getAllMajor']);
    Route::post('/admin/createMajor', [MajorController::class, 'createMajor']);
    Route::get('/admin/showMajor/{major}', [MajorController::class, 'showMajor']);
    Route::put('/admin/updateMajor/{id}', [MajorController::class, 'updateMajor']);
    Route::delete('/admin/destroyMajor/{id}', [MajorController::class, 'destroyMajor']);

    Route::get('/admin/getAllSubject', [SubjectController::class, 'getAllSubject']);
    Route::post('/admin/createSubject', [SubjectController::class, 'createSubject']);
    Route::get('/admin/showSubject/{subject}', [SubjectController::class, 'showSubject']);
    Route::put('/admin/updateSubject/{id}', [SubjectController::class, 'updateSubject']);
    Route::delete('/admin/destroySubject/{id}', [SubjectController::class, 'destroySubject']);

    Route::get('/admin/getAllAssignment', [TeachingAssignment::class, 'getAllAssignmentForAdmin']);
    Route::post('/admin/createAssignment', [TeachingAssignment::class, 'createAssignment']);
    Route::delete('/admin/deleteAssignment/{id}', [TeachingAssignment::class, 'destroyAssignment']);
});

Route::middleware(['auth:sanctum', 'guard:teachers', 'role:teachers,teacher'])->group(function () {
    Route::post('/teacher/logout', [TeacherController::class, 'logoutTeacher']);
    Route::put('/teacher/updatePassword/{id}', [TeacherController::class, 'updatePasswordTeacher']);

    Route::get('/teacher/getAllAssignment', [ScoreController::class, 'getAllAssignmentForTeacher']);
    Route::post('/teacher/storeScore', [ScoreController::class, 'storeScoreForTeacher']);
    });

Route::middleware(['auth:sanctum', 'guard:students', 'role:students,student'])->group(function () {
    Route::post('/student/logout', [StudentController::class, 'logoutStudent']);
    Route::put('/student/updatePassword/{id}', [StudentController::class, 'updatePasswordStudent']);

    Route::get('/student/getMyScores', [ScoreController::class, 'getMyScores']);
});
