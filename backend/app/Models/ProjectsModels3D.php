<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectsModels3D extends Model
{
    use HasFactory;

    protected $table = 'projects_models3D';

    protected $fillable = [
        'project_id',
        'model3D_id',
        'x',
        'y',
        'z',
        'r_x',
        'r_y',
        'r_z'
    ];

    function project()
    {
        return $this->belongsTo(Project::class);
    }

    function model3D()
    {
        return $this->belongsTo(Model3D::class);
    }
}