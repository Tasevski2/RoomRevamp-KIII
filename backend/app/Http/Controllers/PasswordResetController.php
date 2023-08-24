<?php

namespace App\Http\Controllers;

use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Response;

class PasswordResetController extends Controller
{
    function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);
        if ($validator->fails()) {
            return Response::json($validator->errors(), 400);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json('Success')
            : response()->json(['email' => ['Email is not registered on this website!']], 404);
    }

    function resetPasswordView($token, Request $request)
    {
        $email = $request->query('email');
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        return view('auth.reset-password', ['token' => $token, 'email' => $email, 'frontendUrl' => $frontendUrl]);
    }

    function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);
        if ($validator->fails()) {
            return Response::json($validator->errors(), 400);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ]);

                $user->save();

                event(new PasswordReset($user));
            }
        );
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        return $status === Password::PASSWORD_RESET
            ? redirect($frontendUrl . '/login')
            : back()->withErrors(['email' => [__($status)]]);
    }
}