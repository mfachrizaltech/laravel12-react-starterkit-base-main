<?php

namespace App\Repositories;

use App\Models\ReportParameter;
use Illuminate\Support\Facades\Cache;
use DB;
use App\Helpers\QueryHelper;
use App\Helpers\DateUtil;

class ReportParameterRepository extends BaseRepository
{
    public function __construct(ReportParameter $model)
    {
        parent::__construct($model);
    }  

	public function getByReportId(int $reportId)
	{
		return $this->model->newQuery()->where('report_id', $reportId)->get();
	}

	public function upsertReportParamenter($report, $inputParams) {
		$parameters = $report->parameters;
		
		$params = array_keys($inputParams); 
		foreach ($parameters as $parameter) {
			$isFound = false; 
			foreach ($params as $key) {
				if ($parameter->field_code==$key) {
					$isFound = true;
					break;
				}
			}
			if (!$isFound) {
				ReportParameter::find($parameter->id)->delete();				
			}
		}

		foreach ($params as $key) {
			$isFound = false;
			foreach ($parameters as $parameter) {
				if ($parameter->field_code==$key) {
					$isFound = true;
					break;
				}
			} 
			if (!$isFound) {
				$label = ucwords(str_replace('_', ' ', $key)); 
				ReportParameter::create([
					'report_id'=> $report->id,
					'label'=> $label,
					'field_code'=> $key,
					'parameter_type'=> "STRING"
				]);
			}
		} 
	}
 
	public function updateReportParamenter(int $id, array $data)
	{ 
		$parameters = $data['report_parameters'] ?? [];

		foreach ($parameters as $parameterData) {
			if (!isset($parameterData['id'])) {
				continue; // skip if no ID
			}
			$parameter = $this->model->newQuery()->findOrFail($parameterData['id']); 
			$parameter->update([
				'label'          => $parameterData['label'] ?? null,
				'parameter_type' => $parameterData['parameter_type'] ?? null,
				'datasource'     => $parameterData['datasource'] ?? null, 
			]);
		}
	}	
} 