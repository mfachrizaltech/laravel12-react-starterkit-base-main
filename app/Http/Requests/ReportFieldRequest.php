<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\SQL;

class ReportFieldRequest extends FormRequest
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
            'report_fields'                => 'required|array|min:1',   
            'report_fields.*.id'        => 'required|numeric',
            'report_fields.*.label'        => 'required|string',
            'report_fields.*.field_code'   => 'required|string',
            'report_fields.*.data_type'    => 'required|string',
            'report_fields.*.hidden'       => 'required|boolean',
            'report_fields.*.link_form_id' => 'nullable|numeric',
            'report_fields.*.link_param'   => 'nullable|string',
            'report_fields.*.align'        => 'required|string',
            'report_fields.*.order_no'     => 'required|numeric',
        ]; 
    }
}
