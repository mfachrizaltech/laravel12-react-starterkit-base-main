<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CodeRequest extends FormRequest
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
            'code_group' => 'required|string',
            'code' => 'required|string',
            'value1' => 'required|string',
            'value2' => 'nullable|string',
            'order_no' => 'nullable|integer',
            'tag1' => 'nullable|string',
            'tag2' => 'nullable|string',
            'tag3' => 'nullable|string',
            'is_active' => 'required|integer', 
        ];
    }
 
}
