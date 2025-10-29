<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\SQL;

class ReportParameterRequest extends FormRequest
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
            'report_parameters'                  => 'required|array|min:1',   
            'report_parameters.*.id'             => 'required|numeric',
            'report_parameters.*.label'          => 'required|string',
            'report_parameters.*.field_code'     => 'required|string',
            'report_parameters.*.parameter_type' => 'required|string', 
            'report_parameters.*.datasource'     => 'nullable|string', 
        ]; 
    }
}
