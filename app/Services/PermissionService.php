<?php

namespace App\Services;

use App\Repositories\PermissionRepository;

class PermissionService
{ 

    public function __construct(protected PermissionRepository $repository)
    { 
    }
 
    public function search($data)
    {
        return $this->repository->search($data);
    }

    public function getPermissionByGroup()
    {
        return $this->repository->getPermissionByGroup();
    }     
    
    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }

    public function get(int $id)
    {
        return $this->repository->get($id);
    }
}
