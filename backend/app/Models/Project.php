<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Model3D;


class Project extends Model
{
    use HasFactory;

    protected $table = 'project';

    protected $fillable = [
        'name',
        'owner_id',
    ];

    protected $hidden = [
        'owner_id',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class);
    }

    public function models3d()
    {
        return $this->belongsToMany(Model3D::class, 'projects_models3D', 'project_id', 'model3D_id')->withPivot('id', 'x', 'y', 'z', 'r_x', 'r_y', 'r_z');
    }
}