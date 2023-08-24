<?php

namespace App\Http\Controllers;

use App\Models\Model3D;
use Illuminate\Http\Request;
use Response;
use Storage;
use Str;
use Validator;

class Model3DController extends Controller
{
    private $previewImageStoragePath = 'model3D/preview-images';
    private $model3dStoragePath = 'model3D/models';

    function myModels3D(Request $request)
    {
        return response()->json($request->user()->models3d);
    }

    function availableModelsToUser(Request $request)
    {
        $owner_id = $request->user()->id;
        $models = Model3D::where('owner_id', $owner_id)
            ->orWhere('is_public', true)
            ->get();
        return response()->json($models);
    }

    function createModel3D(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'previewImage' => 'required',
            'model3D' => 'required',

        ]);
        if ($validator->fails()) {
            return Response::json($validator->errors(), 400);
        }
        $name = trim($request->input('name'));
        $is_public = $request->input('is_public');
        $previewImage = $request->file('previewImage');
        $model3D = $request->file('model3D');
        $previewImageSrc = $this->storeFile($previewImage, $this->previewImageStoragePath);
        $model3DSrc = $this->storeFile($model3D, $this->model3dStoragePath);
        $newModel3D = new Model3D();
        $newModel3D->fill(['name' => $name, 'owner_id' => $request->user()->id, 'preview_image_src' => $previewImageSrc, 'model_src' => $model3DSrc, 'is_public' => !!$is_public]);
        $newModel3D->save();
        return response()->json($newModel3D);
    }

    function updateModel3D(Request $request, $id)
    {
        $model = Model3D::where('id', $id)->first();
        if (!$model) {
            return response()->json('Model not found!', 404);
        }
        if ($model->owner_id != $request->user()->id) {
            return response()->json('Unauthorized!', 403);
        }
        $updated = false;
        $name = $request->input('name');
        if ($name) {
            $model->name = trim($name);
            $updated = true;
        }
        $is_public_str = $request->input('isPublic');
        if ($is_public_str) {
            $model->is_public = $is_public_str === 'true';
            $updated = true;
        }
        if ($request->hasFile('previewImage')) {
            $src = $this->storeFile($request->file('previewImage'), $this->previewImageStoragePath);
            $this->deleteFile($model->preview_image_src);
            $model->preview_image_src = $src;
            $updated = true;
        }
        if ($request->hasFile('model3D')) {
            $src = $this->storeFile($request->file('model3D'), $this->model3dStoragePath);
            $this->deleteFile($model->model_src);
            $model->model_src = $src;
            $updated = true;
        }
        if ($updated) {
            $model->save();
        }

        return response()->json($model);
    }

    function deleteModel3D($id, Request $request)
    {
        $model = Model3D::find($id);
        if (!$model) {
            return response()->json(['message' => 'Model not found'], 404);
        }
        if ($model->owner_id != $request->user()->id) {
            return response()->json('Unauthorized!', 403);
        }
        $model->delete();
        $this->deleteFile($model->preview_image_src);
        $this->deleteFile($model->model_src);
        $model->preview_image_src = null;
        $model->model_src = null;
        return response()->json($model);
    }

    private function storeFile($file, $path)
    {
        $fileName = time() . '-' . Str::random(20);
        $extension = $file->getClientOriginalExtension();
        $fullPath = $file->storeAs($path, $fileName . '.' . $extension);
        return $fullPath;
    }

    private function deleteFile($fileSrc)
    {
        if (!Storage::exists($fileSrc)) {
            return false;
        }
        Storage::delete($fileSrc);

        return true;
    }
}