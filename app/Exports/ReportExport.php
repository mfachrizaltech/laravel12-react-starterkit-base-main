<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected $records;
    protected $fields;

    public function __construct($records, $fields)
    {
         $this->records = collect($records);
        $this->fields  = $fields;
    }

    public function collection()
    {
        return $this->records;
    }

    public function headings(): array
    {
        // Use report.fields label as header
        return collect($this->fields)->pluck('label')->toArray();
    }

    public function map($row): array
    {
        // Only export fields defined in report.fields
        return collect($this->fields)->map(function ($field) use ($row) {
            return $row->{$field->field_code} ?? '';
        })->toArray();
    }
}
