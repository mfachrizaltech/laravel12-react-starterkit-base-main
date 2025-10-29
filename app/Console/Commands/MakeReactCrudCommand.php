<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;

class MakeReactCrudCommand extends Command
{
    protected $signature = 'make:react-crud {model : The name of the model (e.g. Product)}';
    protected $description = 'Generate React CRUD pages dynamically based on model fields';
    protected Filesystem $files;
    
    protected $excluded = ['id', 'created_at', 'updated_at', 'deleted_at', 'version', 'created_by', 'updated_by'];

    public function __construct(Filesystem $files)
    {
        parent::__construct();
        $this->files = $files;
    }

    public function handle(): void
    {
        $model = Str::studly($this->argument('model'));
        $table = Str::snake(Str::pluralStudly($model)); // e.g. products
        $folder = resource_path("js/pages/" . strtolower(Str::pluralStudly($model)));

        if (!Schema::hasTable($table)) {
            $this->error("Table '{$table}' does not exist.");
            return;
        }

        if (!$this->files->isDirectory($folder)) {
            $this->files->makeDirectory($folder, 0755, true);
        }

        $columns = collect(Schema::getColumnListing($table))
            ->reject(fn ($col) => in_array($col, $this->excluded))
            ->values()
            ->all();

        $this->info("Generating React CRUD pages for: {$model}");
        $this->info("Detected fields: " . implode(', ', $columns));

        // Common reusable data
        $tableColumns = $this->generateTableColumns($model, $columns);
        $filterState = $this->generateFilterState($columns);
        $globalFilters = $this->generateGlobalFilters($columns);
        $useFormCreate = $this->generateUseFormFields($model, $columns, false);
        $useFormEdit = $this->generateUseFormFields($model, $columns, true);

        $stubs = [
            'Index'  => base_path('stubs/react-crud/Index.tsx.stub'),
            'Create' => base_path('stubs/react-crud/Create.tsx.stub'),
            'Edit'   => base_path('stubs/react-crud/Edit.tsx.stub'),
            'Show'   => base_path('stubs/react-crud/Show.tsx.stub'),
        ];

        foreach ($stubs as $name => $stubPath) {
            if (!$this->files->exists($stubPath)) {
                $this->error("Missing stub: {$stubPath}");
                continue;
            }

            // Generate form fields — Show page uses readonly version
            $formFields = str_contains($stubPath, 'Show.tsx.stub')
                ? $this->generateFormFields($model, $columns, true)
                : $this->generateFormFields($model, $columns);

            $content = $this->files->get($stubPath);

            $content = str_replace(
                [
                    '{{ Model }}',
                    '{{ model }}',
                    '{{ modelPlural }}',
                    '{{ form_fields }}',
                    '{{ table_columns }}',
                    '{{ filter_state }}',
                    '{{ global_filters }}',
                    '{{ use_form }}',
                    '{{ use_form_edit }}',
                ],
                [
                    $model,
                    Str::camel($model),
                    Str::plural(Str::camel($model)),
                    $formFields,
                    $tableColumns,
                    $filterState,
                    $globalFilters,
                    $useFormCreate,
                    $useFormEdit,
                ],
                $content
            );

            $target = "{$folder}/{$name}.tsx";
            $this->files->put($target, $content);
            $this->info("✔ Created: {$target}");
        }

        $this->info('✅ React CRUD pages generated successfully!');
    }


    private function generateFormFields($model, array $columns, bool $readonly = false): string
    {
        $result = [];

        foreach ($columns as $column) {
            if (in_array($column, $this->excluded)) continue;
            $label = "{ __('". strtolower($model) . "." . $column . "') }";
            $inputType = $this->getInputType($column);

            if ($readonly) {
                $field = match ($inputType) {
                    'number' => <<<TSX
            <div className="mb-4">
                <label className="block mb-1">{$label}</label>
                <InputNumber
                className="w-full"
                value={data.$column}
                mode="decimal"
                maxFractionDigits={0}
                useGrouping={false}
                readOnly 
                />
            </div>
    TSX,
                    'boolean' => <<<TSX
            <div className="mb-4">
                <label className="block mb-1">{$label}</label>
                <SelectButton
                className="w-full"
                value={data.$column}
                options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                disabled
                />
            </div>
    TSX,
                    default => <<<TSX
            <div className="mb-4">
                <label className="block mb-1">{$label}</label>
                <InputText
                className="w-full"
                value={data.$column}
                readOnly 
                />
            </div>
    TSX
                };
        } else {
            // Create / Edit Page (Editable)
            $field = match ($inputType) {
                'number' => <<<TSX
          <div className="mb-4">
            <label className="block mb-1">{$label} {IsRequired('$column', rules) && <span className="text-red-500">*</span>}</label>
            <InputNumber
              className={`w-full \${clientErrors.$column ? 'p-invalid' : ''}`}
              value={data.$column}
              onValueChange={(e) => setData('$column', e.value ?? null)}
              mode="decimal"
              maxFractionDigits={0}
              useGrouping={false}
            />
            {clientErrors.$column && <small className="text-red-500">{clientErrors.$column}</small>}
          </div>
TSX,
                'boolean' => <<<TSX
          <div className="mb-4">
            <label className="block mb-1">{$label} {IsRequired('$column', rules) && <span className="text-red-500">*</span>}</label>
            <SelectButton
              className={`w-full \${clientErrors.$column ? 'p-invalid' : ''}`}
              value={data.$column}
              options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
              onChange={(e) => setData('$column', e.value)}
            />
            {clientErrors.$column && <small className="text-red-500">{clientErrors.$column}</small>}
          </div>
TSX,
                default => <<<TSX
          <div className="mb-4">
            <label className="block mb-1">{$label} {IsRequired('$column', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full \${clientErrors.$column ? 'p-invalid' : ''}`}
              value={data.$column}
              onChange={(e) => setData('$column', e.target.value)}
            />
            {clientErrors.$column && <small className="text-red-500">{clientErrors.$column}</small>}
          </div>
TSX
            };
        }


            $result[] = $field;
        }

        return implode("\n", $result);
    }
    

    private function generateTableColumns(string $model, array $columns): string
    {
        $cols = [];
        $lower = strtolower($model);
        foreach ($columns as $column) {
            // Special case for is_active / boolean columns
            if (preg_match('/^(is_|has_)/', $column)) {
                $cols[] = <<<TSX
            <Column
                field="$column"
                header={__('$lower.$column')}
                filter
                filterField="$column"
                showFilterMenu={false}
                style={{ textAlign: 'center', minWidth: '12rem' }}
                filterElement={(options) => (
                <SelectButton
                    value={options.value}
                    onChange={(e) => options.filterApplyCallback(e.value)}
                    options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                    optionLabel="label"
                    optionValue="value"
                    className="w-full"
                />
                )}
                body={(rowData) => {
                const status = rowData.$column === 1 ? 'ON' : 'OFF';
                let color = '';
                switch (status) {
                    case 'ON':
                    color = 'bg-green-200 text-green-800';
                    break;
                    case 'OFF':
                    color = 'bg-red-200 text-red-800';
                    break;
                    default:
                    color = 'bg-gray-100 text-gray-700';
                }
                return (
                    <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold \${color}`}
                    >
                    {status}
                    </span>
                );
                }}
            />
    TSX;
            } else {
                // Default normal column
                $cols[] = <<<TSX
            <Column field="$column" header={__('$lower.$column')} sortable filter />
    TSX;
            }
        }

        return implode("\n", $cols);
    }

    private function getInputType(string $column): string
    {
        $lower = strtolower($column);
        if (str_contains($lower, 'price') || str_contains($lower, 'amount') || str_contains($lower, 'total') || str_contains($lower, 'qty')) {
            return 'number';
        }
        if (str_starts_with($lower, 'is_') || str_starts_with($lower, 'has_')) {
            return 'boolean';
        }
        return 'text';
    }

    private function generateFilterState(array $columns): string
    {
        $lines = [];
        foreach ($columns as $column) {
            $lines[] = "    {$column}: { value: null, matchMode: FilterMatchMode.EQUALS },";
        }
        return implode("\n", $lines);
    }

    private function generateGlobalFilters(array $columns): string
    {
        $cols = array_map(fn($c) => "'{$c}'", $columns);
        return '[ ' . implode(', ', $cols) . ' ]';
    }
        
        
    private function generateUseFormFields($model, array $columns, bool $isEdit = false): string
    {
        // Define field types and defaults
        $typedFields = [];
        $defaultValues = [];
        $lower = strtolower($model);

        foreach ($columns as $column) {
            $type = 'string | null';
            $default = "''";

            if (str_contains($column, 'price') || str_contains($column, 'amount') || str_contains($column, 'total') || str_contains($column, 'qty')) {
                $type = 'number | null';
                $default = '0';
            } elseif (str_starts_with($column, 'is_') || str_starts_with($column, 'has_')) {
                $type = 'number | null';
                $default = '1';
            }

            $typedFields[] = "  {$column}: {$type};";
            $defaultValues[] = "  {$column}: {$default},";
        }

        $typedBlock = implode("\n", $typedFields);
        $defaultBlock = implode("\n", $defaultValues);

        if ($isEdit) {
            return <<<TSX
    const { data, setData, put, processing } = useForm<{
    $typedBlock
    }>({
        ...$lower,
    });
    TSX;
        }

        return <<<TSX
    const { data, setData, post, processing } = useForm<{
    $typedBlock
    }>({
    $defaultBlock
    });
    TSX;
    }

}