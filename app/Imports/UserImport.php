<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;

class UserImport implements ToCollection
{
    public array $validRows = [];
    public array $errors = [];

    /**
     * Process imported Excel rows.
     *
     * @param Collection $rows
     */
    public function collection(Collection $rows): void
    {
        unset($rows[0]); //Unset the first row
        foreach ($rows as $index => $row) {
            $data = [
                'name'   => trim($row[0]),
                'email'  => trim($row[1]),
                'phone'  => trim($row[2]),
                'gender' => strtoupper(trim($row[3])),
            ];

            $validator = Validator::make($data, [
                'name'   => 'required|string|max:100',
                'email'  => 'required|email',
                'phone'  => 'required|digits_between:8,15|numeric',
                'gender' => 'required|in:M,F',
            ]);

            if ($validator->fails()) {
                $this->errors[] = [
                    'row'      => $index + 2,
                    'data'     => $data,
                    'messages' => $validator->errors()->all(),
                ];
                continue;
            }

            $this->validRows[] = $data;
        }
    }
}
