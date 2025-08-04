"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import Link from 'next/link'
import { Html5QrcodeScanner } from 'html5-qrcode'

interface ScanResult {
  barcode: string
  vendor: string
  platform: string
  timestamp: string
}

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  // Vendor identification logic based on barcode patterns
  const identifyVendor = (barcode: string): { vendor: string; platform: string } => {
    const code = barcode.toUpperCase()
    
    if (code.startsWith('FK') || code.includes('FLIPKART')) {
      return { vendor: 'Flipkart', platform: 'E-commerce' }
    } else if (code.startsWith('MS') || code.includes('MEESHO')) {
      return { vendor: 'Meesho', platform: 'Social Commerce' }
    } else if (code.startsWith('AM') || code.includes('AMAZON')) {
      return { vendor: 'Amazon', platform: 'E-commerce' }
    } else if (code.startsWith('SN') || code.includes('SNAPDEAL')) {
      return { vendor: 'Snapdeal', platform: 'E-commerce' }
    } else if (code.startsWith('MY') || code.includes('MYNTRA')) {
      return { vendor: 'Myntra', platform: 'Fashion' }
    } else {
      return { vendor: 'Unknown', platform: 'Other' }
    }
  }

  const startScanning = () => {
    setIsScanning(true)
    setError(null)
    setScanResult(null)

    // Wait for the DOM element to be available
    setTimeout(() => {
      const qrReaderElement = document.getElementById("qr-reader")
      if (!qrReaderElement) {
        setError('Scanner element not found. Please try again.')
        setIsScanning(false)
        return
      }

      try {
        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: function(viewfinderWidth, viewfinderHeight) {
              // Make qrbox responsive and support all barcode shapes
              const minEdgePercentage = 0.7; // 70% of the smaller edge
              const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
              return {
                width: qrboxSize,
                height: Math.floor(qrboxSize * 0.6) // Rectangular for better barcode scanning
              };
            },
            aspectRatio: 1.777778 // 16:9 aspect ratio for better scanning
          },
          false
        )

        scannerRef.current.render(
          (decodedText) => {
            // Success callback
            const { vendor, platform } = identifyVendor(decodedText)
            const result: ScanResult = {
              barcode: decodedText,
              vendor,
              platform,
              timestamp: new Date().toLocaleString()
            }
            
            setScanResult(result)
            setIsScanning(false)
            
            // Stop scanning
            if (scannerRef.current) {
              scannerRef.current.clear()
            }
            
            toast.success(`Return scanned successfully! Vendor: ${vendor}`)
          },
          (error) => {
            // Error callback - handle different error types safely
            const errorMessage = typeof error === 'string' ? error : String(error)
            
            // Only log significant errors, ignore common scanning errors
            if (errorMessage.includes('NotFoundException') || 
                errorMessage.includes('No MultiFormat Readers') ||
                errorMessage.includes('No barcode or QR code detected')) {
              // These are normal when no barcode is found, don't show error
              return
            }
            console.warn('Barcode scan error:', errorMessage)
          }
        )
      } catch (err) {
        setError('Failed to start camera. Please check permissions.')
        setIsScanning(false)
        console.error('Scanner initialization error:', err)
      }
    }, 100) // Small delay to ensure DOM is ready
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  const saveReturn = async () => {
    if (!scanResult) return

    try {
      // In a real app, this would save to Firebase
      toast.success('Return logged successfully!')
      
      // Simulate saving delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset for next scan
      setScanResult(null)
    } catch (error) {
      toast.error('Failed to save return')
      console.error('Save error:', error)
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
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
              <h1 className="text-2xl font-bold text-gray-900">Barcode Scanner</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Return Barcode</CardTitle>
              <CardDescription>
                Position the barcode within the frame to scan all barcode types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isScanning && !scanResult && (
                <div className="text-center py-8">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-gray-400 border-dashed rounded"></div>
                  </div>
                  <p className="text-gray-600 mb-4">Click to start scanning</p>
                  <Button onClick={startScanning} className="w-full">
                    Start Scanning
                  </Button>
                </div>
              )}

              {isScanning && (
                <div>
                  <div id="qr-reader" className="mb-4"></div>
                  <Button onClick={stopScanning} variant="outline" className="w-full">
                    Stop Scanning
                  </Button>
                </div>
              )}

              {scanResult && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded"></div>
                  </div>
                  <p className="text-green-600 font-medium mb-4">Scan Successful!</p>
                  <Button onClick={() => setScanResult(null)} variant="outline" className="w-full">
                    Scan Another
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Results</CardTitle>
              <CardDescription>
                Vendor identification and return details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scanResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-600">Barcode</p>
                        <p className="font-mono text-gray-900">{scanResult.barcode}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Timestamp</p>
                        <p className="text-gray-900">{scanResult.timestamp}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Vendor</p>
                        <Badge variant="default">{scanResult.vendor}</Badge>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Platform</p>
                        <Badge variant="secondary">{scanResult.platform}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={saveReturn} className="flex-1">
                      Save Return
                    </Button>
                    <Link href="/qc" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Proceed to QC
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                  <p>No scan results yet</p>
                  <p className="text-sm">Scan a barcode to see details here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Scanning Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                </div>
                <h3 className="font-medium mb-2">All Barcode Types</h3>
                <p className="text-gray-600">Supports QR codes, linear barcodes, and all standard formats</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                </div>
                <h3 className="font-medium mb-2">Good Lighting</h3>
                <p className="text-gray-600">Ensure adequate lighting for clear scanning</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-500 rounded"></div>
                </div>
                <h3 className="font-medium mb-2">Hold Steady</h3>
                <p className="text-gray-600">Keep the camera steady for accurate scanning</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
