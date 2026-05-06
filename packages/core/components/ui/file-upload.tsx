"use client";

import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { Upload, FileIcon, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

interface FileUploadContextValue {
  files: File[];
  removeFile: (index: number) => void;
}

const FileUploadContext = React.createContext<FileUploadContextValue>({
  files: [],
  removeFile: () => {},
});

interface FileUploadProps {
  value?: File[];
  onValueChange?: (files: File[]) => void;
  accept?: DropzoneOptions["accept"];
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FileUpload({
  value,
  onValueChange,
  accept,
  maxSize,
  maxFiles,
  disabled,
  children,
  className,
}: FileUploadProps) {
  const [internalFiles, setInternalFiles] = React.useState<File[]>([]);

  const files = value ?? internalFiles;
  const setFiles = onValueChange ?? setInternalFiles;

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const next = maxFiles
        ? [...files, ...acceptedFiles].slice(0, maxFiles)
        : [...files, ...acceptedFiles];
      setFiles(next);
    },
    [files, setFiles, maxFiles]
  );

  const removeFile = React.useCallback(
    (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    },
    [files, setFiles]
  );

  const dropzone = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    disabled,
  });

  return (
    <FileUploadContext.Provider value={{ files, removeFile }}>
      <div
        data-slot="file-upload"
        className={cn("space-y-3", className)}
      >
        <div
          {...dropzone.getRootProps()}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input p-6 text-center transition-colors",
            "hover:border-primary/50 hover:bg-accent/50",
            dropzone.isDragActive && "border-primary bg-primary/5",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <input {...dropzone.getInputProps()} />
          <Upload className="mb-2 size-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            {dropzone.isDragActive
              ? "Drop files here"
              : "Drag & drop files here, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {maxSize && `Max ${(maxSize / 1024 / 1024).toFixed(0)}MB`}
            {maxSize && maxFiles && " · "}
            {maxFiles && `Up to ${maxFiles} file${maxFiles > 1 ? "s" : ""}`}
          </p>
        </div>
        {children}
      </div>
    </FileUploadContext.Provider>
  );
}

function FileUploadList({ className }: { className?: string }) {
  const { files, removeFile } = React.useContext(FileUploadContext);

  if (files.length === 0) return null;

  return (
    <div data-slot="file-upload-list" className={cn("space-y-2", className)}>
      {files.map((file, index) => (
        <FileUploadItem
          key={`${file.name}-${index}`}
          file={file}
          onRemove={() => removeFile(index)}
        />
      ))}
    </div>
  );
}

function FileUploadItem({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const sizeStr =
    file.size < 1024
      ? `${file.size} B`
      : file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div
      data-slot="file-upload-item"
      className="flex items-center gap-3 rounded-md border border-border p-2"
    >
      <FileIcon className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{sizeStr}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}

export { FileUpload, FileUploadList };
