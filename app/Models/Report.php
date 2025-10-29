<?php


namespace App\Models;

class Report extends BaseModel
{  
	protected $fillable = [
			'name', 'description', 'query', 'is_active'
	];

	public function parameters() {
		return $this->hasMany('App\Models\ReportParameter', 'report_id', 'id');
	}

	public function fields() {
		return $this->hasMany('App\Models\ReportField', 'report_id', 'id')->orderBy('order_no');;
	}
}