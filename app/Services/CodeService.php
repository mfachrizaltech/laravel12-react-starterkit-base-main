<?php

namespace App\Services;

use App\Repositories\CodeRepository;

use Illuminate\Support\Facades\Hash;

class CodeService
{
    public function __construct(protected CodeRepository $codeRepository) {}
 
    public function get($id)
    {
        return $this->codeRepository->get($id);
    }
 
    public function search($data)
    {
        return $this->codeRepository->search($data);
    } 

    public static function getCodeData($codeGroup) {
        return $this->codeRepository->getCodeData($codeGroup);   
    }
 
    public function create(array $data)
    { 
        return $this->codeRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->codeRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->codeRepository->delete($id);
    }
}
