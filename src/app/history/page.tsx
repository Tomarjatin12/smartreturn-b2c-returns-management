"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

interface ReturnRecord {
  id: string
  awbNumber: string
  vendor: string
  platform: string
  returnDate: string
  scannedBy: string
  qcStatus: 'OK' | 'Damaged' | 'Suspicious'
  qcBy?: string
  cnStatus: 'Pending in SAP' | 'Generated' | 'Processing' | 'Failed'
  cnNumber?: string
  amount?: number
  hasMedia: boolean
  mediaCount?: number
  notes?: string
  aiConfidence?: number
  manualOverride?: boolean
}

export default function HistoryPage() {
  const [returnRecords, setReturnRecords] = useState<ReturnRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<ReturnRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [vendorFilter, setVendorFilter] = useState('all')
  const [qcFilter, setQcFilter] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState<ReturnRecord | null>(null)

  // Mock data - in real app, this would come from Firebase
  useEffect(() => {
    const mockData: ReturnRecord[] = [
      {
        id: '1',
        awbNumber: 'FK123456789',
        vendor: 'Flipkart',
        platform: 'E-commerce',
        returnDate: '2024-01-15',
        scannedBy: 'John Doe',
        qcStatus: 'OK',
        qcBy: 'Jane Smith',
        cnStatus: 'Generated',
        cnNumber: 'CN2024001',
        amount: 1299,
        hasMedia: true,
        mediaCount: 2,
        notes: 'Product in good condition, original packaging intact',
        aiConfidence: 0.92,
        manualOverride: false
      },
      {
        id: '2',
        awbNumber: 'MS987654321',
        vendor: 'Meesho',
        platform: 'Social Commerce',
        returnDate: '2024-01-15',
        scannedBy: 'Mike Johnson',
        qcStatus: 'Damaged',
        qcBy: 'Sarah Wilson',
        cnStatus: 'Pending in SAP',
        hasMedia: true,
        mediaCount: 3,
        notes: 'Screen cracked, video documentation uploaded as per Meesho requirements',
        aiConfidence: 0.88,
        manualOverride: true
      },
      {
        id: '3',
        awbNumber: 'AM111222333',
        vendor: 'Amazon',
        platform: 'E-commerce',
        returnDate: '2024-01-14',
        scannedBy: 'John Doe',
        qcStatus: 'OK',
        qcBy: 'Jane Smith',
        cnStatus: 'Processing',
        hasMedia: false,
        notes: 'Standard return, customer changed mind',
        aiConfidence: 0.95,
        manualOverride: false
      },
      {
        id: '4',
        awbNumber: 'SN555666777',
        vendor: 'Snapdeal',
        platform: 'E-commerce',
        returnDate: '2024-01-14',
        scannedBy: 'Sarah Wilson',
        qcStatus: 'Suspicious',
        qcBy: 'Mike Johnson',
        cnStatus: 'Failed',
        hasMedia: true,
        mediaCount: 4,
        notes: 'Potential tampering detected, requires expert review',
        aiConfidence: 0.65,
        manualOverride: true
      },
      {
        id: '5',
        awbNumber: 'MY888999000',
        vendor: 'Myntra',
        platform: 'Fashion',
        returnDate: '2024-01-13',
        scannedBy: 'Jane Smith',
        qcStatus: 'OK',
        qcBy: 'John Doe',
        cnStatus: 'Generated',
        cnNumber: 'CN2024002',
        amount: 2499,
        hasMedia: false,
        notes: 'Size issue return, tags intact',
        aiConfidence: 0.89,
        manualOverride: false
      },
      {
        id: '6',
        awbNumber: 'FK444555666',
        vendor: 'Flipkart',
        platform: 'E-commerce',
        returnDate: '2024-01-12',
        scannedBy: 'Mike Johnson',
        qcStatus: 'Damaged',
        qcBy: 'Sarah Wilson',
        cnStatus: 'Pending in SAP',
        hasMedia: true,
        mediaCount: 2,
        notes: 'Packaging damaged during transit, product condition acceptable',
        aiConfidence: 0.78,
        manualOverride: false
      }
    ]
    
    setReturnRecords(mockData)
    setFilteredRecords(mockData)
  }, [])

  // Filter records based on search and filters
  useEffect(() => {
    let filtered = returnRecords

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.scannedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.cnNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setDate(today.getDate())
          break
        case 'week':
          filterDate.setDate(today.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(today.getMonth() - 1)
          break
      }
      
      filtered = filtered.filter(record => new Date(record.returnDate) >= filterDate)
    }

    // Vendor filter
    if (vendorFilter !== 'all') {
      filtered = filtered.filter(record => record.vendor === vendorFilter)
    }

    // QC filter
    if (qcFilter !== 'all') {
      filtered = filtered.filter(record => record.qcStatus === qcFilter)
    }

    setFilteredRecords(filtered)
  }, [returnRecords, searchTerm, dateFilter, vendorFilter, qcFilter])

  const getStatusBadge = (status: string, type: 'qc' | 'cn') => {
    if (type === 'qc') {
      switch (status) {
        case 'OK':
          return <Badge variant="default">OK</Badge>
        case 'Damaged':
          return <Badge variant="destructive">Damaged</Badge>
        case 'Suspicious':
          return <Badge variant="secondary">Suspicious</Badge>
        default:
          return <Badge variant="outline">{status}</Badge>
      }
    } else {
      switch (status) {
        case 'Generated':
          return <Badge className="bg-green-500">Generated</Badge>
        case 'Pending in SAP':
          return <Badge variant="secondary">Pending</Badge>
        case 'Processing':
          return <Badge className="bg-blue-500">Processing</Badge>
        case 'Failed':
          return <Badge variant="destructive">Failed</Badge>
        default:
          return <Badge variant="outline">{status}</Badge>
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
              <h1 className="text-2xl font-bold text-gray-900">Return History</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
                <p className="text-sm text-gray-600">Total Returns</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredRecords.filter(r => r.qcStatus === 'OK').length}
                </p>
                <p className="text-sm text-gray-600">OK Status</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {filteredRecords.filter(r => r.hasMedia).length}
                </p>
                <p className="text-sm text-gray-600">With Media</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {filteredRecords.filter(r => r.manualOverride).length}
                </p>
                <p className="text-sm text-gray-600">Manual Override</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter return history by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search AWB, Vendor, Staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Vendor</label>
                <Select value={vendorFilter} onValueChange={setVendorFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    <SelectItem value="Flipkart">Flipkart</SelectItem>
                    <SelectItem value="Meesho">Meesho</SelectItem>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="Snapdeal">Snapdeal</SelectItem>
                    <SelectItem value="Myntra">Myntra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">QC Status</label>
                <Select value={qcFilter} onValueChange={setQcFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="OK">OK</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                    <SelectItem value="Suspicious">Suspicious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Return Records ({filteredRecords.length})</CardTitle>
            <CardDescription>
              Complete history of all processed returns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>AWB Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Scanned By</TableHead>
                    <TableHead>QC Status</TableHead>
                    <TableHead>CN Status</TableHead>
                    <TableHead>Media</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">
                        {record.awbNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.vendor}</div>
                          <div className="text-sm text-gray-500">{record.platform}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(record.returnDate)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.scannedBy}</div>
                          {record.qcBy && (
                            <div className="text-sm text-gray-500">QC: {record.qcBy}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(record.qcStatus, 'qc')}
                          {record.manualOverride && (
                            <Badge variant="outline" className="text-xs">Manual</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(record.cnStatus, 'cn')}</TableCell>
                      <TableCell>
                        {record.hasMedia ? (
                          <Badge variant="default">
                            {record.mediaCount} files
                          </Badge>
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedRecord(record)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Return Details</DialogTitle>
                              <DialogDescription>
                                Complete information for AWB: {record.awbNumber}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedRecord && (
                              <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Basic Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">AWB Number:</span>
                                        <span className="font-mono">{selectedRecord.awbNumber}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Vendor:</span>
                                        <span>{selectedRecord.vendor}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Platform:</span>
                                        <span>{selectedRecord.platform}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Return Date:</span>
                                        <span>{formatDate(selectedRecord.returnDate)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Processing Info</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Scanned By:</span>
                                        <span>{selectedRecord.scannedBy}</span>
                                      </div>
                                      {selectedRecord.qcBy && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">QC By:</span>
                                          <span>{selectedRecord.qcBy}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">QC Status:</span>
                                        {getStatusBadge(selectedRecord.qcStatus, 'qc')}
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">CN Status:</span>
                                        {getStatusBadge(selectedRecord.cnStatus, 'cn')}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* AI & Media Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">AI Analysis</h4>
                                    <div className="space-y-2 text-sm">
                                      {selectedRecord.aiConfidence && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">AI Confidence:</span>
                                          <span>{Math.round(selectedRecord.aiConfidence * 100)}%</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Manual Override:</span>
                                        <Badge variant={selectedRecord.manualOverride ? "default" : "secondary"}>
                                          {selectedRecord.manualOverride ? 'Yes' : 'No'}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Media Files</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Has Media:</span>
                                        <Badge variant={selectedRecord.hasMedia ? "default" : "secondary"}>
                                          {selectedRecord.hasMedia ? 'Yes' : 'No'}
                                        </Badge>
                                      </div>
                                      {selectedRecord.mediaCount && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">File Count:</span>
                                          <span>{selectedRecord.mediaCount}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* CN Details */}
                                {(selectedRecord.cnNumber || selectedRecord.amount) && (
                                  <div>
                                    <h4 className="font-medium mb-2">Credit Note Details</h4>
                                    <div className="space-y-2 text-sm">
                                      {selectedRecord.cnNumber && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">CN Number:</span>
                                          <span className="font-mono">{selectedRecord.cnNumber}</span>
                                        </div>
                                      )}
                                      {selectedRecord.amount && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Amount:</span>
                                          <span className="font-medium">₹{selectedRecord.amount.toLocaleString()}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Notes */}
                                {selectedRecord.notes && (
                                  <div>
                                    <h4 className="font-medium mb-2">Notes</h4>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                      {selectedRecord.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredRecords.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                  <p>No return records found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
