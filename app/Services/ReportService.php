<?php

namespace App\Services; 

use Illuminate\Http\Request; 
use App\Report;  
use App\Helpers\DateUtil;
use App\Repositories\ReportRepository;
use App\Repositories\ReportParameterRepository;
use App\Repositories\ReportFieldRepository;

class ReportService extends BaseService
{
	 
  public function __construct(ReportRepository $repository, 
              protected ReportParameterRepository $reportParameterRepository, 
              protected ReportFieldRepository $reportFieldRepository)
  {
    parent::__construct($repository);
  } 

  public function create(array $data)
  {
    $report = parent::create($data); 
    $this->reportFieldRepository->upsertReportField($report);
  }	

  public function update(int $id, array $data)
  {
    $report = parent::update($id, $data); 
    $this->reportFieldRepository->upsertReportField($report);
  }

  public function updateReportField(int $id, array $data)
  { 
    $this->reportFieldRepository->updateReportField($id, $data);
  }  
 
  public function updateReportParameter(int $id, array $data)
  { 
    $this->reportParameterRepository->updateReportParamenter($id, $data);
  } 

  public function getFieldByReportId(int $reportId)
  {
    return $this->reportFieldRepository->getByReportId($reportId);
  }

  public function getParameterByReportId(int $reportId)
  {
    return $this->reportParameterRepository->getByReportId($reportId);
  } 

	public function getReportData($input, $id) 
  {
    return $this->repository->getReportData($input, $id);
  }  

  public function constructRules($parameters): array
  {
      $rules = [];

      foreach ($parameters as $param) {
          $rule = ['required'];

          switch (strtoupper($param->parameter_type)) {
              case 'STRING':
                  $rule[] = 'string';
                  break;

              case 'NUMBER':
                  $rule[] = 'numeric';
                  break;

              case 'INTEGER':
                  $rule[] = 'integer';
                  break;

              case 'BOOLEAN':
                  $rule[] = 'boolean';
                  break;

              default:
                  $rule[] = 'string'; // fallback
                  break;
          }

          $rules[$param->field_code] = implode('|', $rule);
      }

      return $rules;
  }  
}