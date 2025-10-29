<?php

namespace App\Services;

use App\Repositories\UserRepository;

use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(protected UserRepository $userRepository) {}

    public function getAllUsers()
    {
        return $this->userRepository->all();
    }

    public function get($id)
    {
        return $this->userRepository->get($id);
    }


    public function search($keyword)
    {
        return $this->userRepository->searchByKeyword($keyword);
    }

    public function getAllByRoles(array $roles)
    {
        return $this->userRepository->getAllByRoles($roles);
    }

    public function createUser(array $data)
    { 
        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepository->create($data); 
        $roleNames = $data['roles']['name'];;
        $user = $user->syncRoles($roleNames);
        return $user;
    }

    public function updateUser(int $id, array $data)
    {
        // Filter out null or empty string values (but keep false and 0)
        $filteredData = array_filter($data, function ($value) {
            return $value !== null && $value !== '';
        });

        // Hash the password if it's present in filtered data
        if (isset($filteredData['password'])) {
            $filteredData['password'] = Hash::make($filteredData['password']);
        }

        // Update user with filtered data
        $user = $this->userRepository->update($id, $filteredData);

        // Sync roles only if provided
        if (!empty($data['roles']) && is_array($data['roles'])) {
            $roleName = $data['roles']['name'] ?? null;
            if ($roleName) {
                $user->syncRoles([$roleName]);
            }
        }

        return $user;
    }

    public function deleteUser(int $id)
    {
        return $this->userRepository->delete($id);
    }
}
