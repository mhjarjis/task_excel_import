<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ErrorExport implements FromCollection, WithHeadings
{
    protected $errors;
    public function __construct($errors)
    {
        $this->errors = $errors;
    }

    /**
    * @return Collection
    */
    public function collection(): Collection
    {
        return $this->errors;
    }

    public function headings(): array
    {
        return [
            'Row Number',
            'Name',
            'Email',
            'Phone',
            'Gender',
            'Errors',
        ];
    }
}
