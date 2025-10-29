<?php

namespace App\Models;


class Code extends BaseModel
{
	
	protected $fillable = [
			'code_group', 'code', 'value1', 'value2', 'order_no', 'tag1', 'tag2', 'tag3', 'is_active'
	];
	
}
