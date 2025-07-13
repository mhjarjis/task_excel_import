<?php

use App\Http\Controllers\ExcelImportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('ExcelImport');
});

Route::post('excel-import', ExcelImportController::class)->name('excel.import');
