<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Project;

class Model3D extends Model
{
    use HasFactory;

    protected $table = 'model3D';

    protected $fillable = [
        'name',
        'owner_id',
        'model_src',
        'preview_image_src',
        'is_public'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class);
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'projects_models3D', 'model3D_id', 'project_id');
        ;
    }
}