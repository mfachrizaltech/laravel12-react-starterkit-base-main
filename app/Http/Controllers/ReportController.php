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

class ReportController extends Controller { 
	
    public function __construct(protected ReportService $reportService) 
    {

    }
	
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->all();
        $reports = $this->reportService->search($data); 
        return Inertia::render('reports/Index', [
                                'reports' => $reports, 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $reportRequest = new ReportRequest();
        $rules = $reportRequest->rules(); 
        return Inertia::render('reports/Create', [
            'rules' => $rules
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ReportRequest $request)
    {
        try {
            $validatedData = $request->validated(); 
            $product = $this->reportService->create($validatedData);
            return redirect()->route('reports-maintenance.index')->with('success', __('label.update_successfully'));     
        } catch (\Exception $e) { 
            dd($e);
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }    


    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $reportRequest = new ReportRequest();
        $rules = $reportRequest->rules(); 
        $report = $this->reportService->get($id); 
        return Inertia::render('reports/Edit', [
            'rules' => $rules,
            'report' => $report
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(int $id, ReportRequest $request)
    {
        try {
            $validatedData = $request->validated(); 
            $product = $this->reportService->update($id, $validatedData);
            return redirect()->route('reports-maintenance.index')->with('success', __('label.update_successfully'));     
        } catch (\Exception $e) {  
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try {
            $this->reportService->delete($id);
            return redirect()->route('reports-maintenance.index')->with('success', __('label.deleted_successfully'));     
        } catch (\Exception $e) {      
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));        
    }
	  
	
	public function fieldEdit($id) { 
        $reportFieldRequest = new ReportFieldRequest();
        $rules = $reportFieldRequest->rules();         
        $reportFields = $this->reportService->getFieldByReportId($id); 
        $dataTyeOptions = CodeHelper::getCodeData('REPORT_DATA_TYPE'); 
        $reportOptions = DatasourceHelper::getDataSource('REPORT');   
        $alignOptions = CodeHelper::getCodeData('REPORT_ALIGN'); 
        return Inertia::render('reports/Field', [ 
            'rules' => $rules,
            'reportId' => $id,
            'reportFields' => $reportFields,
            'dataTyeOptions' => $dataTyeOptions, 
            'reportOptions' => $reportOptions,
            'alignOptions' => $alignOptions,
        ]);		
	} 

    public function fieldUpdate(int $id, ReportFieldRequest $request)
    {
        try {
		$validatedData = $request->validated();  
		$this->reportService->updateReportField($id, $validatedData); 
            return redirect()->route('reports-maintenance.index')->with('success', __('label.update_successfully'));     
        } catch (\Exception $e) {   
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }    
 
	public function paramEdit($id) { 
        $reportParameterRequest = new ReportParameterRequest();
        $rules = $reportParameterRequest->rules();         
        $reportParameters = $this->reportService->getParameterByReportId($id); 
        $parameterTypeOptions = CodeHelper::getCodeData('REPORT_PARAMETER_TYPE');  
        $datasourceOptions = CodeHelper::getCodeData('DATASOURCE');    
 
        return Inertia::render('reports/Parameter', [ 
            'rules' => $rules,
            'reportId' => $id,
            'reportParameters' => $reportParameters,
            'parameterTypeOptions' => $parameterTypeOptions, 
            'datasourceOptions' => $datasourceOptions, 
        ]);			
	}
	
    public function paramUpdate(int $id, ReportParameterRequest $request)
    {
        try {
		$validatedData = $request->validated();  
		$this->reportService->updateReportParameter($id, $validatedData); 
            return redirect()->route('reports-maintenance.index')->with('success', __('label.update_successfully'));     
        } catch (\Exception $e) {   
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }    
 

}