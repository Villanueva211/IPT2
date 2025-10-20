<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('faculties', FacultyController::class);
    Route::apiResource('students', StudentController::class);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('academic-years', AcademicYearController::class);

    Route::get('/stats/counts', [DashboardController::class, 'getCounts']);
    Route::get('/reports/{type}', [ReportController::class, 'generate']);
});
