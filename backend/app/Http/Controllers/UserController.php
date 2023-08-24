<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Response;

class UserController extends Controller
{
    function me(Request $request)
    {
        return response()->json($request->user());
    }

    function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'oldPassword' => 'required',
            'newPassword' => 'required'
        ]);
        if ($validator->fails()) {
            return Response::json($validator->errors(), 400);
        }
        $oldPassword = $request->input('oldPassword');
        $newPassword = $request->input('newPassword');
        $user = $request->user();
        if (!Hash::check($oldPassword, $user->password)) {
            return response()->json(['oldPassword' => ['Incorrect old password!']], 401);
        }
        $user->password = Hash::make($newPassword);
        $user->save();
        return response()->json('Success');
    }
}