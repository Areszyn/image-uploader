'use client'
import { useState, useRef } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Home() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const fileInputRef = useRef(null)

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const finalFileName = fileName ? `${fileName}.${fileExt}` : file.name
    
    const { error } = await supabase.storage
      .from('uploads')
      .upload(`public/${finalFileName}`, file)
    
    if (error) {
      alert('Upload failed: ' + error.message)
      setUploading(false)
      return
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(`public/${finalFileName}`)
    
    setImageUrl(publicUrl)
    setUploadComplete(true)
    setUploading(false)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name.split('.').slice(0, -1).join('.'))
    }
  }

  const resetForm = () => {
    setFile(null)
    setFileName('')
    setUploadComplete(false)
    setImageUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Image Uploader</h1>
          
          {!uploadComplete ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  ref={fileInputRef}
                  accept="image/*"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  {file ? (
                    <span className="text-blue-600">{file.name}</span>
                  ) : (
                    <span>Click to select an image</span>
                  )}
                </label>
              </div>

              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Custom filename (optional)"
                className="w-full p-2 border rounded"
              />

              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full p-2 rounded text-white ${uploading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-100 rounded">
                <p className="text-green-800">Upload successful!</p>
              </div>
              <input
                type="text"
                value={imageUrl}
                readOnly
                className="w-full p-2 border rounded"
              />
              <button
                onClick={() => navigator.clipboard.writeText(imageUrl)}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Copy URL
              </button>
              <button
                onClick={resetForm}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Upload Another
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
