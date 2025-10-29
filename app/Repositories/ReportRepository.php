<?php

namespace App\Repositories;

use App\Models\Report;
use Illuminate\Support\Facades\Cache;
use DB;
use App\Helpers\QueryHelper;
use App\Helpers\DateUtil;

class ReportRepository extends BaseRepository
{
    protected array $with = ['parameters', 'fields'];

    public function __construct(Report $model)
    {
        parent::__construct($model);
    }

	public function getReportData($input, $id) {
		$params = []; 
		$report = $this->model->find($id);
		$reportParam = $report->parameters;
		foreach ($reportParam as $param) {
			$value = $input[$param->field_code];
			// if ($param->parameter_type=="DATE") {
			// 	$value = DateUtil::dateFormatDB($value);
			// } 
			$params += [$param->field_code => $value];
		}   
		$data = DB::select($report->query, $params);  
		return $data;
	}
	 

	public function getReportData2($input, $id)
	{
		$params = []; 
		$report = $this->model->find($id);
		$reportParam = $report->parameters;

		foreach ($reportParam as $param) {
			$value = $input[$param->field_code] ?? null;
			$params[$param->field_code] = $value;
		}

		// Convert the raw query into query builder
		// If $report->query contains "select ... from table where ..."
		// we can wrap it with DB::table / DB::raw
		$query = DB::table(DB::raw("({$report->query}) as t"))
					->when($params, function ($q) use ($params) {
						foreach ($params as $key => $value) {
							if (!is_null($value)) {
								$q->where($key, $value);
							}
						}
					});

		// Use paginate
		$perPage = $input['per_page'] ?? 15;
		$data = $query->paginate($perPage);

		return $data;
	}

} 