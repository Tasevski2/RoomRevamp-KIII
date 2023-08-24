<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\Model3DController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['prefix' => 'auth'], function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::group(['middleware' => ['auth:sanctum']], function () {
        Route::get('/logout', [AuthController::class, 'logout']);
        Route::get('/check-jwt', [AuthController::class, 'checkJwt']);
    });
});

Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword'])->name('password.email');

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::group(['prefix' => 'user'], function () {
        Route::get('/me', [UserController::class, 'me']);
        Route::post('/change-password', [UserController::class, 'changePassword']);
    });

    Route::group(['prefix' => 'project'], function () {
        Route::get('/my-projects', [ProjectController::class, 'myProjects']);
        Route::get('/{id}', [ProjectController::class, 'projectWithModels']);
        Route::post('/', [ProjectController::class, 'createProject']);
        Route::post('/{id}', [ProjectController::class, 'updateProject']);
        Route::post('/{id}/models', [ProjectController::class, 'updateProjectModels']);
        Route::delete('/{id}', [ProjectController::class, 'deleteProject']);
    });

    Route::group(['prefix' => 'model3D'], function () {
        Route::get('/my-models3D', [Model3DController::class, 'myModels3D']);
        Route::get('/available', [Model3DController::class, 'availableModelsToUser']);
        Route::post('/', [Model3DController::class, 'createModel3D']);
        Route::post('/{id}', [Model3DController::class, 'updateModel3D']);
        Route::delete('/{id}', [Model3DController::class, 'deleteModel3D']);
    });

    Route::get('/image', [MediaController::class, 'getImage']);
    Route::get('/model3D', [MediaController::class, 'getModel3D']);
});