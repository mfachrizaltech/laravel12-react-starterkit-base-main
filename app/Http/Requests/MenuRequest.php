<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuRequest extends FormRequest
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
            'parent_id' => 'nullable|integer',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'icon_id' => 'nullable|string',
            'url' => 'required|string', 
            'is_active' => 'required|integer',
        ]; 
    }
}
