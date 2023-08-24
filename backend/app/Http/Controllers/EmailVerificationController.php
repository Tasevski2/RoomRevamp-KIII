<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class EmailVerificationController extends Controller
{
    function __invoke($id, Request $request)
    {
        $frontend_url = env('FRONTEND_URL', 'http://localhost:3000');
        if (!$request->hasValidSignature()) {
            redirect()->away($frontend_url . '?verified=0');
        }
        $user = User::where('id', $id)->first();
        if (!$user) {
            redirect()->away($frontend_url . '?verified=0');
        }
        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }
        return Redirect::away($frontend_url . '?verified=1');
    }
}