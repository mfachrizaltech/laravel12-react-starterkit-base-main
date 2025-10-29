<?php


namespace App\Models;

class ReportField extends BaseModel
{  
	protected $fillable = [
			'report_id', 'label', 'field_code', 'data_type', 'hidden', 'link_form_id', 'link_param', 'align', 'order_no'
	];

}