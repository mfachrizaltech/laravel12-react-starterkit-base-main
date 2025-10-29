<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class MakeCrudCommand extends Command
{
    protected $signature = 'make:crud {model}';
    protected $description = 'Generate Model, Controller, Service, Repository, and Request based on a table migration';
    protected $excluded = ['id', 'created_at', 'updated_at', 'deleted_at', 'version', 'created_by', 'updated_by'];

    public function handle()
    {
        $modelName = Str::studly($this->argument('model'));
        $tableName = Str::snake(Str::pluralStudly($modelName));

        if (!Schema::hasTable($tableName)) {
            $this->error("Table [$tableName] not found. Make sure migration exists and run `php artisan migrate`.");
            return;
        }

        $this->createModel($modelName);
        $this->createRepository($modelName);
        $this->createService($modelName);
        $this->createController($modelName);
        $this->createRequest($modelName, $tableName);
        $this->createLanguageFile($modelName);

        $this->info("✅ CRUD files for [$modelName] generated successfully.");
    }
 
    protected function createModel($model)
    {
        $path = app_path("Models/{$model}.php");
        if (File::exists($path)) return;

        $tableName = Str::snake(Str::pluralStudly($model));
        $columns = Schema::getColumnListing($tableName);

         $fillableColumns = array_values(array_diff($columns, $this->excluded));

        // Build the $fillable array as a string
        $fillableString = "['" . implode("', '", $fillableColumns) . "']";

        $content = "<?php

    namespace App\Models;

    use App\Models\BaseModel;

    class {$model} extends BaseModel
    {
        protected \$fillable = {$fillableString};
    }
    ";
        File::ensureDirectoryExists(app_path('Models'));
        File::put($path, $content);
        $this->info("Model created: {$path}");
    }

    protected function createRepository($model)
    {
        $path = app_path("Repositories/{$model}Repository.php");
        if (File::exists($path)) return;

        $content = "<?php

namespace App\Repositories;

class {$model}Repository extends BaseRepository
{
    public function __construct(\\App\\Models\\{$model} \$model)
    {
        parent::__construct(\$model);
    }
}
";
        File::ensureDirectoryExists(app_path('Repositories'));
        File::put($path, $content);
        $this->info("Repository created: {$path}");
    }

    protected function createService($model)
    {
        $path = app_path("Services/{$model}Service.php");
        if (File::exists($path)) return;

        $content = "<?php

namespace App\Services;

use App\Repositories\\{$model}Repository;

class {$model}Service extends BaseService
{
    public function __construct({$model}Repository \$repository)
    {
        parent::__construct(\$repository);
    }
}
";
        File::ensureDirectoryExists(app_path('Services'));
        File::put($path, $content);
        $this->info("Service created: {$path}");
    }

    protected function createController($model)
    {
        $controller = "{$model}Controller";
        $serviceVar = Str::camel($model) . 'Service';
        $requestVar = "{$model}Request";
        $viewFolder = Str::kebab(Str::pluralStudly($model)); // e.g., Report -> reports
        $routeName = "{$viewFolder}.index";

        $path = app_path("Http/Controllers/{$controller}.php");
        if (File::exists($path)) return;

        $content = "<?php

    namespace App\Http\Controllers;

    use App\Http\Requests\\{$model}Request;
    use App\Services\\{$model}Service;
    use Illuminate\Http\Request;
    use Inertia\Inertia;

    class {$controller} extends Controller
    {
        public function __construct(protected {$model}Service \${$serviceVar})
        {
        }

        /**
         * Display a listing of the resource.
         */
        public function index(Request \$request)
        {
            \$data = \$request->all();
            \$items = \$this->{$serviceVar}->search(\$data);
            return Inertia::render('{$viewFolder}/Index', [
                '{$viewFolder}' => \$items,
            ]);
        }

        /**
         * Show the form for creating a new resource.
         */
        public function create()
        {
            \$request = new {$requestVar}();
            \$rules = \$request->rules();

            return Inertia::render('{$viewFolder}/Create', [
                'rules' => \$rules,
            ]);
        }

        /**
         * Store a newly created resource in storage.
         */
        public function store({$requestVar} \$request)
        {
            try {
                \$validated = \$request->validated();
                \$this->{$serviceVar}->create(\$validated);
                return redirect()->route('{$routeName}')->with('success', __('label.update_successfully'));
            } catch (\\Exception \$e) {
                return redirect()->back()->with('error', __('label.error_message'));
            }
        }

        /**
         * Display the specified resource.
         */
        public function show(int \$id)
        { 
            \$item = \$this->{$serviceVar}->get(\$id);

            return Inertia::render('{$viewFolder}/Show', [ 
                '" . strtolower($model) . "' => \$item
            ]);
        }

        /**
         * Show the form for editing the specified resource.
         */
        public function edit(int \$id)
        {
            \$request = new {$requestVar}();
            \$rules = \$request->rules();
            \$item = \$this->{$serviceVar}->get(\$id);

            return Inertia::render('{$viewFolder}/Edit', [
                'rules' => \$rules,
                '" . strtolower($model) . "' => \$item
            ]);
        }

        /**
         * Update the specified resource in storage.
         */
        public function update(int \$id, {$requestVar} \$request)
        {
            try {
                \$validated = \$request->validated();
                \$this->{$serviceVar}->update(\$id, \$validated);
                return redirect()->route('{$routeName}')->with('success', __('label.update_successfully'));
            } catch (\\Exception \$e) {
                return redirect()->back()->with('error', __('label.error_message'));
            }
        }

        /**
         * Remove the specified resource from storage.
         */
        public function destroy(int \$id)
        {
            try {
                \$this->{$serviceVar}->delete(\$id);
                return redirect()->route('{$routeName}')->with('success', __('label.deleted_successfully'));
            } catch (\\Exception \$e) {
                return redirect()->back()->with('error', __('label.error_message'));
            }
        }
    }
    ";
        File::ensureDirectoryExists(app_path('Http/Controllers'));
        File::put($path, $content);
        $this->info("Controller created: {$path}");
    }


    protected function createRequest($model, $table)
    {
        $request = "{$model}Request";
        $path = app_path("Http/Requests/{$request}.php");
        if (File::exists($path)) return;

        $columns = Schema::getColumnListing($table);

         $rules = [];

        foreach ($columns as $column) {
            if (in_array($column, $this->excluded)) continue;
            $rules[$column] = 'required'; // (Optionally: extend logic per column type later)
        }

        $rulesString = var_export($rules, true);

        $content = "<?php

    namespace App\Http\Requests;

    use Illuminate\Foundation\Http\FormRequest;

    class {$request} extends FormRequest
    {
        public function authorize(): bool
        {
            return true;
        }

        public function rules(): array
        {
            return {$rulesString};
        }
    }
    ";
        File::ensureDirectoryExists(app_path('Http/Requests'));
        File::put($path, $content);
        $this->info("Request created: {$path}");
    }

    protected function createLanguageFile($model)
    {
        $tableName = Str::snake(Str::pluralStudly($model));
        $fields = array_values(array_diff(Schema::getColumnListing($tableName), $this->excluded));

        $translations = [
            Str::snake($model) => Str::headline($model),
            $tableName => Str::headline($tableName),
            'add_new_' . Str::snake($model) => 'Add New ' . Str::headline($model),
            'edit_' . Str::snake($model) => 'Edit ' . Str::headline($model),
            'show_' . Str::snake($model) => 'Show ' . Str::headline($model),
        ];

        foreach ($fields as $field) {
            $translations[$field] = Str::headline($field);
        }

        // Convert array to short PHP array syntax
        $translationString = var_export($translations, true);
        $translationString = preg_replace("/array\s*\(/", "[", $translationString);
        $translationString = preg_replace("/\)$/", "]", $translationString);

        // English file
        $enPath = resource_path("lang/en/" . Str::snake($model) . ".php");
        File::ensureDirectoryExists(dirname($enPath));
        File::put($enPath, "<?php\n\nreturn {$translationString};\n");
        $this->info("Language file created: {$enPath}");

        // Indonesian file
        $idTranslations = $translations;
        // Optional: If you want some words localized in ID directly, map them here
        $idTranslations['add_new_' . Str::snake($model)] = 'Tambah ' . Str::headline($model) . ' Baru';
        $idTranslations['edit_' . Str::snake($model)] = 'Edit ' . Str::headline($model);
        $idTranslations['show_' . Str::snake($model)] = 'Show ' . Str::headline($model);

        $idString = var_export($idTranslations, true);
        $idString = preg_replace("/array\s*\(/", "[", $idString);
        $idString = preg_replace("/\)$/", "]", $idString);

        $idPath = resource_path("lang/id/" . Str::snake($model) . ".php");
        File::ensureDirectoryExists(dirname($idPath));
        File::put($idPath, "<?php\n\nreturn {$idString};\n");
        $this->info("Language file created: {$idPath}");
    }


}
