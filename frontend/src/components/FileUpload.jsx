import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

const API_URL = import.meta.env.VITE_API_URL || 'https://upturnly-data-app-529304626037.europe-west1.run.app';

const FileUpload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [message, setMessage] = useState('');

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            setStatus(null);
            setMessage('');
        }
    }, []);

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setStatus(null);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setStatus('success');
            setMessage(response.data.message || 'Upload successful!');
            if (onUploadSuccess) onUploadSuccess();
            setFile(null);
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.detail || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <div
                className={clsx(
                    "border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer bg-[#111113]/50 backdrop-blur-sm",
                    isDragging ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(255,90,42,0.1)]" : "border-[#2A2A2C] hover:border-primary/50 hover:bg-[#1A1A1C]",
                    status === 'success' && "border-green-500/50 bg-green-500/5",
                    status === 'error' && "border-red-500/50 bg-red-500/5"
                )}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".csv"
                    onChange={onFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className={clsx("p-4 rounded-full transition-colors", isDragging ? "bg-primary/20" : "bg-[#2A2A2C]")}>
                            <Upload className={clsx("w-8 h-8", isDragging ? "text-primary shadow-primary" : "text-slate-400")} />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-slate-200">
                                {file ? file.name : "Drop CSV file here or click to upload"}
                            </p>
                            {!file && <p className="text-sm text-slate-500 mt-2">Support for .csv files</p>}
                        </div>
                    </div>
                </label>
            </div>

            {file && (
                <div className="flex items-center justify-between p-4 bg-[#1A1A1C] rounded-xl border border-[#2A2A2C] mt-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-[#2A2A2C] rounded-lg">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-200">{file.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="px-5 py-2.5 bg-gradient-to-r from-primary to-[#FF7A5A] hover:from-[#E04818] hover:to-primary text-white rounded-lg text-sm font-semibold shadow-[0_0_15px_rgba(255,90,42,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {uploading ? 'Uploading...' : 'Upload Data'}
                    </button>
                </div>
            )}

            {message && (
                <div className={clsx(
                    "mt-4 p-4 rounded-lg flex items-center gap-3",
                    status === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                )}>
                    {status === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm">{message}</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
