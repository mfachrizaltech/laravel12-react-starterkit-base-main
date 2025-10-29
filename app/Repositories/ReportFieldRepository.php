<?php

namespace App\Repositories;

use App\Models\ReportField;
use Illuminate\Support\Facades\Cache;
use DB;
use App\Helpers\QueryHelper;
use App\Repositories\ReportParameterRepository;

class ReportFieldRepository extends BaseRepository
{
    public function __construct(ReportField $model, protected ReportParameterRepository $reportParameterRepository)
    {
        parent::__construct($model);
    }

	public function getByReportId(int $reportId)
	{
		return $this->model->newQuery()->where('report_id', $reportId)->orderBy('order_no')->get();
	}
	
	public function upsertReportField($report)
	{ 	
		$query = $report->query;
        $regex = '~(:\w+)~'; 
        preg_match_all($regex, $query, $matches, PREG_PATTERN_ORDER);
        $params = []; 
        foreach($matches[0] as $key) {
            $key = str_replace(':', '', $key); 
            $params += [$key=>0];
		}
		$query = "select a.* from `dummy` left join (  ". $query . ") a on 1 = 1";
		$data = DB::select($query, $params);  
		$keys = array_keys(get_object_vars($data[0])); 
		
		$fields = $report->fields;
		
		foreach ($fields as $field) {
			$isFound = false;
			foreach ($keys as $key) {
				if ($field->field_code==$key) {
					$isFound = true;
					break;
				}
			}
			if (!$isFound) { 
				parent::delete($field->id);			
			}
		}
		$orderNo = 1;
		foreach ($keys as $key) {
			$isFound = false;
			$field;
			foreach ($fields as $field) {
				if ($field->field_code==$key) {
					$isFound = true;
					break;
				}
			}
			if ($isFound) {
				parent::update($field->id, ['order_no'=> $orderNo]);
			} else {
				$label = ucwords(str_replace('_', ' ', $key)); 

				parent::create([
					'report_id'=> $report->id,
					'label'=> $label,
					'field_code'=> $key,
					'data_type'=> "STRING",
					'hidden'=> 0, 
					'align'=> "LEFT",
					'order_no'=> $orderNo,
				]); 
			}
			$orderNo++;
		} 
		$this->reportParameterRepository->upsertReportParamenter($report, $params);
	}

	public function updateReportField(int $id, array $data)
	{
		$fields = $data['report_fields'] ?? [];

		foreach ($fields as $fieldData) {
			if (!isset($fieldData['id'])) {
				continue; // skip if no ID
			}

			$field = $this->model->newQuery()->findOrFail($fieldData['id']);

			$field->update([
				'label'        => $fieldData['label'] ?? null,
				'data_type'    => $fieldData['data_type'] ?? null,
				'hidden'       => $fieldData['hidden'] ?? null,
				'link_form_id' => $fieldData['link_form_id'] ?? null,
				'align'        => $fieldData['align'] ?? null,
				'order_no'     => $fieldData['order_no'] ?? null, // include ordering if needed
			]);
		}
	}

} 