<?php

namespace App\Services;

use App\Repositories\RoleRepository;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;

class RoleService
{
    public function __construct(protected RoleRepository $roleRepository) {}
 
    public function getAll()
    {
        return $this->roleRepository->all();
    } 
 
    public function search(array $data)
    {  
        return $this->roleRepository->search($data);
    }     
 
    public function get($id)
    {
        return $this->roleRepository->get($id);
    } 
    
    public function create(array $data)
    { 
        $data['name'] = Str::slug($data['label']);
        $role = $this->roleRepository->create($data);
        return $role;
    }

    public function update(int $id, array $data)
    {
        $data['name'] = Str::slug($data['label']);
        $role = $this->roleRepository->update($id, $data);
    } 

    public function delete(int $id)
    {
        return $this->roleRepository->delete($id);
    }

    public function assignMenus(Role $role, array $menuIds) 
    { 
        return $this->roleRepository->assignMenus($role, $menuIds);
    }

    public function assignPermissions(Role $role, array $permissionsIds) 
    { 
        return $this->roleRepository->assignPermissions($role, $permissionsIds);
    }       
 
}
