<?php

namespace App\Services;

use App\Repositories\BaseRepository;

class BaseService
{
    protected BaseRepository $repository;

    public function __construct(BaseRepository $repository)
    {
        $this->repository = $repository;
    }

    public function search(array $data = [])
    {
        return $this->repository->search($data);
    }

    public function get(int $id)
    {
        return $this->repository->get($id);
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
        return $this->repository->delete($id);
    }
}
