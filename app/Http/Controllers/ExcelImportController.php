<?php

namespace App\Http\Controllers;

use App\Exports\ErrorExport;
use App\Imports\UserImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class ExcelImportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $request->validate(['file' => 'required|mimes:xlsx,xls|max:1024']);

        $import = new UserImport();
        Excel::import($import, $request->file('file'));

        $failedFileUrl = null;
        if (count($import->errors)) {
            $exportData = collect($import->errors)->map(fn($item) => [
                'Row Number'    => $item['row'],
                'Name'          => $item['data']['name'],
                'Email'         => $item['data']['email'],
                'Phone'         => $item['data']['phone'],
                'Gender'        => $item['data']['gender'],
                'Errors'        => implode(', ', $item['messages']),
            ]);

            $fileName = 'failed_rows_'.time().'.xlsx';
            Excel::store(new ErrorExport($exportData), $fileName, 'public');
            $failedFileUrl = Storage::url($fileName);
        }

        return response()->json([
            'success'        => count($import->validRows),
            'failed'         => count($import->errors),
            'errors'         => $import->errors,
            'failedFileUrl'  => $failedFileUrl,
        ]);
    }
}
