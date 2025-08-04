"use client"

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import Link from 'next/link'

interface UploadedFile {
  id: string
  name: string
  type: 'image' | 'video'
  size: number
  url: string
  uploadedAt: string
}

interface UploadData {
  awbNumber: string
  vendor: string
  files: UploadedFile[]
  notes: string
}

export default function UploadPage() {
  const [uploadData, setUploadData] = useState<UploadData>({
    awbNumber: '',
    vendor: 'Meesho',
    files: [],
    notes: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/')
      const isValidSize = file.size <= 50 * 1024 * 1024 // 50MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image or video file`)
        return false
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 50MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadedFiles: UploadedFile[] = []

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + Math.random() * 10
            return newProgress > 90 ? 90 : newProgress
          })
        }, 100)

        // Create object URL for preview (in real app, upload to Firebase Storage)
        const url = URL.createObjectURL(file)
        
        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + i,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          size: file.size,
          url,
          uploadedAt: new Date().toLocaleString()
        }

        uploadedFiles.push(uploadedFile)
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        clearInterval(progressInterval)
      }

      setUploadProgress(100)
      setUploadData(prev => ({
        ...prev,
        files: [...prev.files, ...uploadedFiles]
      }))

      toast.success(`${uploadedFiles.length} file(s) uploaded successfully!`)
    } catch (error) {
      toast.error('Upload failed. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadData(prev => ({
      ...prev,
      files: prev.files.filter(file => file.id !== fileId)
    }))
    toast.success('File removed')
  }

  const saveUploadData = async () => {
    if (!uploadData.awbNumber.trim()) {
      toast.error('Please enter AWB number')
      return
    }

    if (uploadData.files.length === 0) {
      toast.error('Please upload at least one file')
      return
    }

    try {
      // In a real app, this would save to Firebase with file URLs
      console.log('Saving upload data:', uploadData)
      
      toast.success('Upload data saved successfully!')
      
      // Reset form
      setUploadData({
        awbNumber: '',
        vendor: 'Meesho',
        files: [],
        notes: ''
      })
    } catch (error) {
      toast.error('Failed to save upload data')
      console.error('Save error:', error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Media Upload</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Photos & Videos</CardTitle>
              <CardDescription>
                Upload media files for return documentation (especially for Meesho)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AWB Number Input */}
              <div className="space-y-2">
                <Label htmlFor="awb">AWB Number *</Label>
                <Input
                  id="awb"
                  placeholder="Enter AWB/Return number"
                  value={uploadData.awbNumber}
                  onChange={(e) => setUploadData(prev => ({ ...prev, awbNumber: e.target.value }))}
                />
              </div>

              {/* Vendor Selection */}
              <div className="space-y-2">
                <Label>Vendor</Label>
                <div className="flex space-x-2">
                  {['Meesho', 'Flipkart', 'Amazon', 'Other'].map((vendor) => (
                    <Button
                      key={vendor}
                      variant={uploadData.vendor === vendor ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUploadData(prev => ({ ...prev, vendor }))}
                    >
                      {vendor}
                    </Button>
                  ))}
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-400 rounded"></div>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drop files here or click to browse
                    </p>
                    <p className="text-sm text-gray-600">
                      Support for images and videos up to 50MB
                    </p>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileInput}
                className="hidden"
              />

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about the return..."
                  value={uploadData.notes}
                  onChange={(e) => setUploadData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Files</CardTitle>
              <CardDescription>
                Preview and manage uploaded media files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadData.files.length > 0 ? (
                <div className="space-y-4">
                  {uploadData.files.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm truncate">{file.name}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {file.type}
                            </Badge>
                            <span>{formatFileSize(file.size)}</span>
                            <span>{file.uploadedAt}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      
                      {/* File Preview */}
                      <div className="mt-3">
                        {file.type === 'image' ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.onerror = null
                              target.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8d6fc000-544e-42da-bf4c-412bdb2abdc4.png"
                            }}
                          />
                        ) : (
                          <video
                            src={file.url}
                            className="w-full h-32 object-cover rounded"
                            controls
                            onError={(e) => {
                              console.error('Video preview error:', e)
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={saveUploadData} className="w-full">
                    Save Upload Data
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                  <p>No files uploaded yet</p>
                  <p className="text-sm">Upload files to see previews here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upload Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="w-12 h-12 mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                </div>
                <h3 className="font-medium mb-2">File Requirements</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Images: JPG, PNG, WEBP</li>
                  <li>• Videos: MP4, MOV, AVI</li>
                  <li>• Maximum size: 50MB per file</li>
                  <li>• Clear, well-lit photos</li>
                </ul>
              </div>
              <div>
                <div className="w-12 h-12 mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                </div>
                <h3 className="font-medium mb-2">Best Practices</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Multiple angles of damage</li>
                  <li>• Include packaging condition</li>
                  <li>• Show serial numbers if visible</li>
                  <li>• Document all accessories</li>
                </ul>
              </div>
              <div>
                <div className="w-12 h-12 mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-500 rounded"></div>
                </div>
                <h3 className="font-medium mb-2">Meesho Requirements</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Video documentation mandatory</li>
                  <li>• Show unboxing process</li>
                  <li>• Highlight defects clearly</li>
                  <li>• Include AWB in frame</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
