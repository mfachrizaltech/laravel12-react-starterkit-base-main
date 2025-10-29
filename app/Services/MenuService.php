<?php

namespace App\Services;

use App\Repositories\MenuRepository;

use Illuminate\Support\Facades\Hash;

class MenuService
{
    public function __construct(protected MenuRepository $menuRepository) {}
 
    public function get($id)
    {
        return $this->menuRepository->get($id);
    }

    public function getAll()
    {
        return $this->menuRepository->all();
    } 
 
    public function getActiveMenu()
    {
        return $this->menuRepository->getActiveMenu();
    } 


    public function getActiveMenusByRole($role)
    {
        return $this->menuRepository->getActiveMenusByRole($role);
    }     
    

    public function search(?string $keyword = null)
    {
        return $this->menuRepository->searchByKeyword($keyword);
    }     

    public function create(array $data)
    { 
        // Ensure 'parent_id' is present, even if null
        $parentId = $data['parent_id'] ?? null;

        // Calculate next order_number
        $lastOrderNumber = $this->menuRepository->getLastOrderNumber($parentId);
        $data['order_number'] = ($lastOrderNumber ?? 0) + 1;

        return $this->menuRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->menuRepository->update($id, $data);
    }
 

    public function delete(int $id)
    {
        return $this->menuRepository->delete($id);
    }


    public function reorder(array $menus)
    {
        return $this->menuRepository->reorder($menus);
    } 

}
