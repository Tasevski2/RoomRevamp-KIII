<?php

namespace App\Http\Controllers;

use File;
use Illuminate\Http\Request;
use Storage;

class MediaController extends Controller
{

    function getImage(Request $request)
    {
        $src = $request->query('src');
        $path = storage_path('app/' . $src);
        error_log('Src: ' . $src);
        if (Storage::exists($src)) {
            $fileContents = file_get_contents($path);
            $contentType = File::mimeType($path);

            return response($fileContents, 200)->header('Content-Type', $contentType);
        }

        return response()->json(['message' => 'Image not found'], 404);
    }


    function getModel3D(Request $request)
    {
        $src = $request->query('src');
        $path = storage_path('app/' . $src);
        error_log('Src: ' . $src);
        if (Storage::exists($src)) {
            return response()->file($path);
        }

        return response()->json(['message' => 'Image not found'], 404);
    }
}