<?php

namespace App\Services;

use App\Repositories\CashDepositRepository;
use Illuminate\Support\Carbon;
use Auth;

class CashDepositService
{
    public function __construct(protected CashDepositRepository $cashDepositRepository) {}
 
    public function get($id)
    {
        return $this->cashDepositRepository->get($id);
    }

    public function search($keyword)
    {
        return $this->cashDepositRepository->search($keyword);
    }
 
    public function getAllCashPayment()
    {
        return $this->cashDepositRepository->getAllCashPayment();
    }

    public function create(array $data)
    { 
        return $this->cashDepositRepository->create($data); 
    }

    public function createWithDetails(array $data)
    {          
        return $this->cashDepositRepository->createWithDetails($data); 
    }    
 
    public function update(int $id, array $data)
    { 
        return $this->cashDepositRepository->update($id, $data);   
    }

    public function delete(int $id)
    {
        return $this->cashDepositRepository->delete($id);
    }


    public function updateDepositStatus(int $id, array $data)
    {  
        $data['manager_id'] = Auth::id();
        $data['manager_name'] = Auth::user()?->name;
        if ($data['deposit_status']==='APPROVED') {
            return $this->cashDepositRepository->update($id, $data); 
        } else {
            return $this->cashDepositRepository->updateDeleteDetail($id, $data); 
        }
    }



    
}
