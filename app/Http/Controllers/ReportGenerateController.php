<?php 

namespace App\Http\Controllers; 

use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Route;  
use Illuminate\Support\Facades\Lang;
use App\Services\ReportService;
use App\Http\Requests\ReportParameterRequest;
use App\Http\Requests\ReportFieldRequest;
use App\Http\Requests\ReportRequest;
use Inertia\Inertia; 
use App\Helpers\CodeHelper;  
use App\Helpers\DatasourceHelper; 
use Illuminate\Pagination\LengthAwarePaginator;
use App\Exports\ReportExport;
use Maatwebsite\Excel\Facades\Excel;

class ReportGenerateController extends Controller { 
	
    public function __construct(protected ReportService $reportService) 
    {

    }
	
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->all();
        $data['filters']['is_active'] = [
            'value' => 1,
            'matchMode' => 'Equals'
        ]; 
        $reports = $this->reportService->search($data); 
        return Inertia::render('reportGenerate/Index', [
                                'reports' => $reports, 
        ]);
    }

	public function generate(Request $request, $id)
	{      
        $report = $this->reportService->get($id);  
		$input = $request->all(); 
        $rules = $this->reportService->constructRules($report->parameters);

        $datasourceOptions = DatasourceHelper::getMultipleDatasource($report->parameters); 
		$data = [];  
		if (count($input)>=count($report->parameters)) {
			$data = $this->reportService->getReportData($input, $id);	 
		} 
        $data = $this->arrayPaginator($data, $request, 10); 
        return Inertia::render('reportGenerate/Report', [
                                'rules' => $rules,
                                'report' => $report, 
                                'records' => $data,
                                'datasourceOptions' => $datasourceOptions,
        ]);
    }

	public function arrayPaginator($array, $request, $perPage)
	{
		$page = $request->get('page', 1); 
		$offset = ($page * $perPage) - $perPage;
	
		return new LengthAwarePaginator(array_slice($array, $offset, $perPage, true), count($array), $perPage, $page,
			['path' => $request->url(), 'query' => $request->query()]);
	}


	public function download(Request $request, $id)
	{      
        $report = $this->reportService->get($id);  
		$input = $request->all(); 
        $rules = $this->reportService->constructRules($report->parameters);

        $datasourceOptions = DatasourceHelper::getMultipleDatasource($report->parameters); 
		$data = [];  
		if (count($input)>=count($report->parameters)) {
			$data = $this->reportService->getReportData($input, $id);	 
		} 
        return Excel::download(new ReportExport($data, $report->fields), $report->name . '.xlsx');
    }

	public function print(Request $request, $id)
	{      
        $report = $this->reportService->get($id);  
		$input = $request->all(); 
        $rules = $this->reportService->constructRules($report->parameters);

        $datasourceOptions = DatasourceHelper::getMultipleDatasource($report->parameters); 
		$data = [];  
		if (count($input)>=count($report->parameters)) {
			$data = $this->reportService->getReportData($input, $id);	 
		} 
        return Inertia::render('reportGenerate/Print', [
                                'rules' => $rules,
                                'report' => $report, 
                                'records' => $data,
                                'datasourceOptions' => $datasourceOptions,
                                'input' => $input,
        ]);
    }    
}