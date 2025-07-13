#  Excel Importer (Laravel + Inertia.js + React)

This project is an **Excel file importer** using **Laravel**, **Inertia.js**, and **React**, built to upload and validate `.xlsx/.xls` files, store valid rows, and report errors on a row/column basis. Failed rows are exportable for user correction.

---

## Features

- Upload `.xlsx` or `.xls` files via drag & drop
- Validate each row (e.g., required fields, format, type, value)
- Display row-wise validation errors
- Download failed rows as Excel
- ShadCN-powered modern UI
- Progress bar with real-time upload feedback

---

## Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Backend     | Laravel 12          |
| Frontend    | Inertia.js + React   |
| UI          | ShadCN + TailwindCSS |
| Excel       | Maatwebsite/Excel    |
| Upload      | React Dropzone + Axios |

---

## Project Structure
excel-importer/

├── app/

│ ├── Exports/ErrorExport.php

│ └── Imports/UserImport.php

├── Http/Controllers/ExcelImportController.php

├── resources/js/Pages/ExcelImport.tsx

├── routes/web.php

├── public/storage/

└── storage/app/public/



