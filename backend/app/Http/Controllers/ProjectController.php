<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectsModels3D;
use Illuminate\Http\Request;
use Validator;

class ProjectController extends Controller
{
    function myProjects(Request $request)
    {
        return response()->json($request->user()->projects);
    }

    function projectWithModels($id)
    {
        $project = Project::with('models3d')->find($id);
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        return response()->json($project);
    }

    function updateProject($id, Request $request)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json('Not found!', 404);
        }
        if ($project->owner_id != $request->user()->id) {
            return response()->json('Unauthorized!', 403);
        }
        $name = $request->input('name');
        $updated = false;
        if ($name) {
            $project->name = trim($name);
            $updated = true;
        }
        if ($updated) {
            $project->save();
        }
        return response()->json($project);
    }

    function updateProjectModels($id, Request $request)
    {
        $models = $request->input('models');
        $modelsToInsert = [];
        $modelsToUpdate = [];
        $modelsIdsToDelete = [];
        foreach ($models as $model) {
            if ($model['status'] === 'added') {
                $_model = ['project_id' => $id, 'model3D_id' => $model['model3D_id'], 'x' => $model['x'], 'y' => $model['y'], 'z' => $model['z'], 'r_x' => $model['r_x'], 'r_y' => $model['r_y'], 'r_z' => $model['r_z']];
                array_push($modelsToInsert, $_model);
            } elseif ($model['status'] === 'edited') {
                $_model = ['id' => $model['id'], 'project_id' => $id, 'model3D_id' => $model['model3D_id'], 'x' => $model['x'], 'y' => $model['y'], 'z' => $model['z'], 'r_x' => $model['r_x'], 'r_y' => $model['r_y'], 'r_z' => $model['r_z']];
                array_push($modelsToUpdate, $_model);
            } elseif ($model['status'] === 'deleted') {
                array_push($modelsIdsToDelete, $model['id']);
            }
        }

        if (count($modelsIdsToDelete) > 0) {
            ProjectsModels3D::whereIn('id', $modelsIdsToDelete)
                ->delete();
        }

        if (count($modelsToUpdate) > 0) {
            ProjectsModels3D::upsert($modelsToUpdate, ['id']);
        }

        if (count($modelsToInsert) > 0) {
            ProjectsModels3D::insert($modelsToInsert);
        }

        return response()->json(['message' => 'Updated successfully'], 200);
    }

    function createProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $name = trim($request->input('name'));
        $ownerId = $request->user()->id;
        $project = new Project();
        $project->fill(['name' => $name, 'owner_id' => $ownerId]);
        $project->save();

        return response()->json($project);
    }

    function deleteProject($id, Request $request)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        if ($project->owner_id != $request->user()->id) {
            return response()->json('Unauthorized!', 403);
        }
        $project->delete();
        return response()->json($project);
    }
}