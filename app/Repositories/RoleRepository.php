<?php

namespace App\Repositories;

use App\Models\Role;
use DB;
use App\Helpers\QueryHelper;

class RoleRepository extends BaseRepository
{  
    protected array $with = ['menus', 'permissions'];

    public function __construct(Role $model)
    {
        $this->model = $model;
    }

    function humanizeRouteName(string $route): string
    {
        return ucwords(str_replace('.', ' ', $route));
    }    

    public function assignMenus(Role $role, array $menuIds): void
    { 
        DB::transaction(function () use ($role, $menuIds) { 
            $role->menus()->sync($menuIds);
        });
    }

    public function assignPermissions(Role $role, array $permissionIds): void
    {
        $validIds = array_filter($permissionIds, fn($id) => is_numeric($id));
      
        DB::transaction(function () use ($role, $validIds) { 
            $role->syncPermissions($validIds);
        });
    }  
}
