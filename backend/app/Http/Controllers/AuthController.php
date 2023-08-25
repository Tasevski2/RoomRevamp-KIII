<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Response;
use App\Models\User;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            return Response::json($validator->errors(), 400);
        }
        $email = $request->input('email');
        $user = User::where('email', $email)->first();
        if ($user) {
            $errors = ['email' => ['Email is taken!']];
            return Response::json($errors, 409);
        }
        $password = $request->input('password');
        $hashedPassword = Hash::make($password);
        $newUser = new User();

        $newUser->fill(['email' => $email, 'password' => $hashedPassword]);
        $newUser->save();
        $newUser->sendEmailVerificationNotification();
        return response()->json('Successful user registration!');
    }

    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            return Response::json($validator->errors(), 400);
        }
        $email = $request->input('email');
        $password = $request->input('password');
        $user = User::where('email', $email)->first();
        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json(['error' => ['Your email or password is incorrect!']], 401);
        }
        if (!$user->email_verified_at) {
            return response()->json(['error' => ['Your email is not verified!']], 401);
        }
        return response()->json(['token' => $user->createToken(Str::random(20))->plainTextToken, 'user' => $user]);
    }

    function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json('Success');
    }

    function checkJwt()
    {
        return response()->json('Success');
    }
}