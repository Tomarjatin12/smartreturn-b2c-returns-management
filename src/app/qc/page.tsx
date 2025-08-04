"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import Link from 'next/link'
import { predictQC, initializeTensorFlow } from '@/lib/tfqc'

interface QCResult {
  prediction: 'OK' | 'Damaged' | 'Suspicious'
  confidence: number
  manualOverride?: 'OK' | 'Damaged' | 'Suspicious'
  timestamp: string
  imageData: string
}

export default function QCPage() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [qcResult, setQcResult] = useState<QCResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [manualOverride, setManualOverride] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [tfInitialized, setTfInitialized] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize TensorFlow.js on component mount
  useEffect(() => {
    const initTF = async () => {
      try {
        await initializeTensorFlow()
        setTfInitialized(true)
        setError(null) // Clear any previous errors
      } catch (error) {
        console.error('Failed to initialize TensorFlow:', error)
        setTfInitialized(false)
        setError('AI model initialization failed. Manual tagging is available.')
      }
    }
    
    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      initTF()
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access not supported in this browser.')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCapturing(true)
      }
    } catch (err) {
      const error = err as Error
      if (error.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.')
      } else if (error.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else {
        setError('Failed to access camera. Please check permissions and try again.')
      }
      console.error('Camera access error:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCapturing(false)
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
    
    // Stop camera after capture
    stopCamera()
    
    // Start AI processing
    processWithAI(imageData)
  }

  const processWithAI = async (imageData: string) => {
    if (!tfInitialized) {
      toast.error('AI model not initialized. Please use manual tagging.')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await predictQC(imageData)
      
      const qcData: QCResult = {
        prediction: result.prediction,
        confidence: result.confidence,
        timestamp: new Date().toLocaleString(),
        imageData
      }

      setQcResult(qcData)
      
      if (result.error) {
        setError(`AI processing warning: ${result.error}`)
      }
      
      toast.success(`AI Analysis Complete: ${result.prediction} (${Math.round(result.confidence * 100)}% confidence)`)
    } catch (error) {
      setError('AI processing failed. Please use manual override.')
      console.error('AI processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const saveQCResult = async () => {
    if (!qcResult) return

    try {
      const finalResult = {
        ...qcResult,
        manualOverride: manualOverride || undefined,
        finalStatus: manualOverride || qcResult.prediction
      }

      // In a real app, this would save to Firebase
      console.log('Saving QC result:', finalResult)
      
      toast.success('QC result saved successfully!')
      
      // Reset for next item
      resetForm()
    } catch (error) {
      toast.error('Failed to save QC result')
      console.error('Save error:', error)
    }
  }

  const resetForm = () => {
    setCapturedImage(null)
    setQcResult(null)
    setManualOverride('')
    setError(null)
    setIsProcessing(false)
  }

  const retakePhoto = () => {
    resetForm()
    startCamera()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

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
              <h1 className="text-2xl font-bold text-gray-900">AI QC Tagging</h1>
            </div>
            <Badge variant={tfInitialized ? "default" : "secondary"}>
              {tfInitialized ? "AI Ready" : "Manual Only"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image Capture</CardTitle>
              <CardDescription>
                Capture a clear image of the returned product for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isCapturing && !capturedImage && (
                <div className="text-center py-8">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-gray-400 border-dashed rounded"></div>
                  </div>
                  <p className="text-gray-600 mb-4">Start camera to capture product image</p>
                  <Button onClick={startCamera} className="w-full">
                    Start Camera
                  </Button>
                </div>
              )}

              {isCapturing && (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg"
                      style={{ maxHeight: '400px' }}
                    />
                    <div className="absolute inset-0 border-2 border-blue-500 border-dashed rounded-lg pointer-events-none"></div>
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={captureImage} className="flex-1">
                      Capture Image
                    </Button>
                    <Button onClick={stopCamera} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured product"
                      className="w-full rounded-lg"
                      style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </div>
                  <Button onClick={retakePhoto} variant="outline" className="w-full">
                    Retake Photo
                  </Button>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>

          {/* AI Analysis Section */}
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>
                Automated quality assessment with manual override option
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-8 h-8 bg-blue-500 rounded"></div>
                    </div>
                    <p className="font-medium mb-2">Processing with AI...</p>
                    <Progress value={75} className="w-full" />
                  </div>
                </div>
              )}

              {qcResult && !isProcessing && (
                <div className="space-y-6">
                  {/* AI Prediction */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-3">AI Prediction</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge 
                        variant={
                          qcResult.prediction === 'OK' ? 'default' : 
                          qcResult.prediction === 'Damaged' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {qcResult.prediction}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className="text-sm font-medium">
                        {Math.round(qcResult.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Manual Override */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Manual Override (Optional)</h3>
                    <Select value={manualOverride} onValueChange={setManualOverride}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manual assessment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OK">OK - Good Condition</SelectItem>
                        <SelectItem value="Damaged">Damaged - Defective</SelectItem>
                        <SelectItem value="Suspicious">Suspicious - Needs Review</SelectItem>
                      </SelectContent>
                    </Select>
                    {manualOverride && (
                      <p className="text-sm text-gray-600">
                        Manual override will be used instead of AI prediction
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button onClick={saveQCResult} className="flex-1">
                      Save QC Result
                    </Button>
                    <Link href="/upload" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Upload Media
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {!qcResult && !isProcessing && (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                  <p>No analysis results yet</p>
                  <p className="text-sm">Capture an image to start AI analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* QC Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>QC Assessment Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <Badge className="mb-3">OK</Badge>
                <h3 className="font-medium mb-2">Good Condition</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• No visible damage</li>
                  <li>• Original packaging intact</li>
                  <li>• All accessories present</li>
                  <li>• Functional as expected</li>
                </ul>
              </div>
              <div>
                <Badge variant="destructive" className="mb-3">Damaged</Badge>
                <h3 className="font-medium mb-2">Defective</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Physical damage visible</li>
                  <li>• Missing parts/accessories</li>
                  <li>• Packaging severely damaged</li>
                  <li>• Non-functional</li>
                </ul>
              </div>
              <div>
                <Badge variant="secondary" className="mb-3">Suspicious</Badge>
                <h3 className="font-medium mb-2">Needs Review</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Unclear condition</li>
                  <li>• Potential tampering</li>
                  <li>• Unusual wear patterns</li>
                  <li>• Requires expert review</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
