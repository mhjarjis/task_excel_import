'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {CheckCircle, CircleX, DownloadCloud} from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface ExcelImportProps {
    success?: number;
    failed?: number;
    errors?: {
        row: number;
        data: Record<string, any>;
        messages: string[];
    }[];
    failedFileUrl?: string;
}

export default function ExcelImport() {
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [response, setResponse] = useState<ExcelImportProps>({
        success: 0,
        failed: 0,
        errors: [],
        failedFileUrl: '',
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        maxFiles: 1,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setSubmitting(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/excel-import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    if (e.total) {
                        setUploadProgress(Math.round((e.loaded * 100) / e.total));
                    }
                },
            });

            setResponse(res.data);
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setSubmitting(false);
        }
    };

    // @ts-ignore
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Excel File</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div
                            {...getRootProps()}
                            className={`cursor-pointer border border-dashed rounded-md p-6 text-center transition ${
                                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-muted'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <p className="text-sm text-muted-foreground">
                                {file ? file.name : 'Drag & drop Excel file or click to select'}
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={!file || submitting}
                            className="w-full"
                        >
                            {submitting ? 'Uploading...' : 'Upload'}
                        </Button>

                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <Progress value={uploadProgress} className="h-2" />
                        )}
                    </form>
                </CardContent>
            </Card>

            {(response.success || response.failed) > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" /> Success: {response.success}
                        </p>
                        <p className="flex items-center gap-2 text-red-600">
                            <CircleX className="w-4 h-4" /> Failed: {response.failed}
                        </p>

                        {response.failedFileUrl && (
                            <a
                                href={response.failedFileUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="flex items-center gap-2 text-blue-600 underline"
                            >
                                <DownloadCloud className="w-4 h-4" /> Download Failed Rows
                            </a>
                        )}
                    </CardContent>

                </Card>
            )}

            {response.errors?.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Error Details</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Row</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Errors</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {response.errors.map((err, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{err.row}</TableCell>
                                        <TableCell className="whitespace-pre-wrap text-muted-foreground">
                                            {JSON.stringify(err.data, null, 2)}
                                        </TableCell>
                                        <TableCell>
                                            <ul className="list-disc list-inside space-y-1">
                                                {err.messages.map((msg, i) => (
                                                    <li key={i}>{msg}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
