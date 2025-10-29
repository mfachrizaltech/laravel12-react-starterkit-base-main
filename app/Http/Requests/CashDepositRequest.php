<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CashDepositRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    { 
        return [
            'deposit_date'         => 'required|date', 
            'depositor_id'         => 'required|numeric', 
            'depositor_name'         => 'required|string', 
            'total_amount'         => 'required|numeric',
            'deposit_status'         => 'required|string',
            'deposit_amount'       => 'required|numeric', 
            'cash_deposit_details' => 'required|array|min:1',       
        ];
    } 

}