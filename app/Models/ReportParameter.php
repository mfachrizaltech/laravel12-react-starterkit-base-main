<?php


namespace App\Models;

class ReportParameter extends BaseModel
{  
	protected $fillable = [
			'report_id', 'label', 'field_code', 'required', 'parameter_type', 'datasource' 
	];
}