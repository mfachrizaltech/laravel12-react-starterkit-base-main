<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role as SpatieRole;
use Illuminate\Database\Eloquent\SoftDeletes;
use Yajra\Auditable\AuditableTrait;

class Role extends SpatieRole
{
    use SoftDeletes, AuditableTrait;

    protected $dates = ['deleted_at'];

	protected $timestamp=true;

    protected $fillable = [
        'name',
        'label',
        'description',
        'is_active',
        'guard_name'
    ];

    public function menus()
    {
        return $this->belongsToMany(Menu::class);
    }
    
    public function activeMenus()
    {
        return $this->belongsToMany(Menu::class)->where('is_active', true);
    }    
}
