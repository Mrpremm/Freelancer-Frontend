import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image } from 'lucide-react'

const FileUpload = ({ files, onChange, maxFiles = 5, maxSize = 5 * 1024 * 1024 }) => {
  const [errors, setErrors] = useState([])

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setErrors([])
    
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(file => 
        file.errors.map(error => ({
          fileName: file.file.name,
          message: error.code === 'file-too-large' 
            ? 'File is too large' 
            : error.code === 'file-invalid-type'
            ? 'Invalid file type'
            : error.message
        }))
      ).flat()
      setErrors(newErrors)
    }
    
    if (acceptedFiles.length > 0) {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
      onChange(newFiles)
    }
  }, [files, maxFiles, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxSize,
    maxFiles
  })

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        {isDragActive ? (
          <p className="text-primary-600 font-medium">Drop the files here...</p>
        ) : (
          <div>
            <p className="font-medium mb-2">Drag & drop files here, or click to select</p>
            <p className="text-sm text-gray-500">
              Upload up to {maxFiles} images (JPG, PNG, WebP). Max size: {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="text-red-600 text-sm flex items-center">
              <X size={16} className="mr-2" />
              {error.fileName}: {error.message}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {file.type?.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="text-gray-400" size={32} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload