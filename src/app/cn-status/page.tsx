"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

interface CNRecord {
  id: string
  awbNumber: string
  vendor: string
  platform: string
  returnDate: string
  qcStatus: 'OK' | 'Damaged' | 'Suspicious'
  cnStatus: 'Pending in SAP' | 'Generated' | 'Processing' | 'Failed'
  cnNumber?: string
  cnDate?: string
  amount?: number
}

export default function CNStatusPage() {
  const [cnRecords, setCnRecords] = useState<CNRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<CNRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [vendorFilter, setVendorFilter] = useState<string>('all')

  // Mock data - in real app, this would come from Firebase
  useEffect(() => {
    const mockData: CNRecord[] = [
      {
        id: '1',
        awbNumber: 'FK123456789',
        vendor: 'Flipkart',
        platform: 'E-commerce',
        returnDate: '2024-01-15',
        qcStatus: 'OK',
        cnStatus: 'Generated',
        cnNumber: 'CN2024001',
        cnDate: '2024-01-16',
        amount: 1299
      },
      {
        id: '2',
        awbNumber: 'MS987654321',
        vendor: 'Meesho',
        platform: 'Social Commerce',
        returnDate: '2024-01-14',
        qcStatus: 'Damaged',
        cnStatus: 'Pending in SAP',
      },
      {
        id: '3',
        awbNumber: 'AM111222333',
        vendor: 'Amazon',
        platform: 'E-commerce',
        returnDate: '2024-01-13',
        qcStatus: 'OK',
        cnStatus: 'Processing',
      },
      {
        id: '4',
        awbNumber: 'SN555666777',
        vendor: 'Snapdeal',
        platform: 'E-commerce',
        returnDate: '2024-01-12',
        qcStatus: 'Suspicious',
        cnStatus: 'Failed',
      },
      {
        id: '5',
        awbNumber: 'MY888999000',
        vendor: 'Myntra',
        platform: 'Fashion',
        returnDate: '2024-01-11',
        qcStatus: 'OK',
        cnStatus: 'Generated',
        cnNumber: 'CN2024002',
        cnDate: '2024-01-12',
        amount: 2499
      },
      {
        id: '6',
        awbNumber: 'FK444555666',
        vendor: 'Flipkart',
        platform: 'E-commerce',
        returnDate: '2024-01-10',
        qcStatus: 'Damaged',
        cnStatus: 'Pending in SAP',
      }
    ]
    
    setCnRecords(mockData)
    setFilteredRecords(mockData)
  }, [])

  // Filter records based on search and filters
  useEffect(() => {
    let filtered = cnRecords

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.cnNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.cnStatus === statusFilter)
    }

    // Vendor filter
    if (vendorFilter !== 'all') {
      filtered = filtered.filter(record => record.vendor === vendorFilter)
    }

    setFilteredRecords(filtered)
  }, [cnRecords, searchTerm, statusFilter, vendorFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Generated':
        return <Badge className="bg-green-500">Generated</Badge>
      case 'Pending in SAP':
        return <Badge variant="secondary">Pending in SAP</Badge>
      case 'Processing':
        return <Badge className="bg-blue-500">Processing</Badge>
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getQCBadge = (status: string) => {
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
  }

  const refreshData = () => {
    // In real app, this would fetch fresh data from Firebase
    window.location.reload()
  }

  const exportData = () => {
    // Convert filtered records to CSV
    const headers = ['AWB Number', 'Vendor', 'Platform', 'Return Date', 'QC Status', 'CN Status', 'CN Number', 'CN Date', 'Amount']
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => [
        record.awbNumber,
        record.vendor,
        record.platform,
        record.returnDate,
        record.qcStatus,
        record.cnStatus,
        record.cnNumber || '',
        record.cnDate || '',
        record.amount || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cn-status-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
              <h1 className="text-2xl font-bold text-gray-900">CN Status</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={refreshData} variant="outline" size="sm">
                Refresh
              </Button>
              <Button onClick={exportData} size="sm">
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Generated</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cnRecords.filter(r => r.cnStatus === 'Generated').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cnRecords.filter(r => r.cnStatus === 'Pending in SAP').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cnRecords.filter(r => r.cnStatus === 'Processing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cnRecords.filter(r => r.cnStatus === 'Failed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter CN records by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search AWB, Vendor, or CN Number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">CN Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Generated">Generated</SelectItem>
                    <SelectItem value="Pending in SAP">Pending in SAP</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
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
            </div>
          </CardContent>
        </Card>

        {/* CN Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>CN Records ({filteredRecords.length})</CardTitle>
            <CardDescription>
              View-only access to credit note generation status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>AWB Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>QC Status</TableHead>
                    <TableHead>CN Status</TableHead>
                    <TableHead>CN Number</TableHead>
                    <TableHead>CN Date</TableHead>
                    <TableHead>Amount</TableHead>
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
                      <TableCell>{record.returnDate}</TableCell>
                      <TableCell>{getQCBadge(record.qcStatus)}</TableCell>
                      <TableCell>{getStatusBadge(record.cnStatus)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {record.cnNumber || '-'}
                      </TableCell>
                      <TableCell>{record.cnDate || '-'}</TableCell>
                      <TableCell>
                        {record.amount ? `₹${record.amount.toLocaleString()}` : '-'}
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
                  <p>No records found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>CN Generation Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                </div>
                <h3 className="font-medium mb-2">Return Logged</h3>
                <p className="text-gray-600">Return is scanned and QC completed in the app</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                </div>
                <h3 className="font-medium mb-2">Pending in SAP</h3>
                <p className="text-gray-600">Data sent to head office SAP system for processing</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-500 rounded"></div>
                </div>
                <h3 className="font-medium mb-2">Processing</h3>
                <p className="text-gray-600">SAP system validates and processes the CN request</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                </div>
                <h3 className="font-medium mb-2">Generated</h3>
                <p className="text-gray-600">CN is generated with number and amount details</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
