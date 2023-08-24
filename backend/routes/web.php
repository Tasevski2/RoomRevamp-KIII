<?php


use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\PasswordResetController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, '__invoke'])->middleware('signed')->name('verification.verify');

Route::get('/reset-password/{token}', [PasswordResetController::class, 'resetPasswordView'])->name('password.reset');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->name('password.update');