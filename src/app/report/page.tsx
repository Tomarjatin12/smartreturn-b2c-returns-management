"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import Link from 'next/link'
import * as XLSX from 'xlsx'

interface ReturnRecord {
  id: string
  awbNumber: string
  vendor: string
  platform: string
  returnDate: string
  qcStatus: 'OK' | 'Damaged' | 'Suspicious'
  cnStatus: 'Pending in SAP' | 'Generated' | 'Processing' | 'Failed'
  cnNumber?: string
  amount?: number
  hasMedia: boolean
  notes?: string
}

interface ReportFilters {
  startDate: string
  endDate: string
  vendor: string
  platform: string
  qcStatus: string
  cnStatus: string
}

export default function ReportPage() {
  const [returnRecords, setReturnRecords] = useState<ReturnRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<ReturnRecord[]>([])
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    vendor: 'all',
    platform: 'all',
    qcStatus: 'all',
    cnStatus: 'all'
  })
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data - in real app, this would come from Firebase
  useEffect(() => {
    const mockData: ReturnRecord[] = [
      {
        id: '1',
        awbNumber: 'FK123456789',
        vendor: 'Flipkart',
        platform: 'E-commerce',
        returnDate: '2024-01-15',
        qcStatus: 'OK',
        cnStatus: 'Generated',
        cnNumber: 'CN2024001',
        amount: 1299,
        hasMedia: true,
        notes: 'Product in good condition'
      },
      {
        id: '2',
        awbNumber: 'MS987654321',
        vendor: 'Meesho',
        platform: 'Social Commerce',
        returnDate: '2024-01-15',
        qcStatus: 'Damaged',
        cnStatus: 'Pending in SAP',
        hasMedia: true,
        notes: 'Screen cracked, video uploaded'
      },
      {
        id: '3',
        awbNumber: 'AM111222333',
        vendor: 'Amazon',
        platform: 'E-commerce',
        returnDate: '2024-01-15',
        qcStatus: 'OK',
        cnStatus: 'Processing',
        hasMedia: false,
        notes: 'Standard return'
      },
      {
        id: '4',
        awbNumber: 'SN555666777',
        vendor: 'Snapdeal',
        platform: 'E-commerce',
        returnDate: '2024-01-14',
        qcStatus: 'Suspicious',
        cnStatus: 'Failed',
        hasMedia: true,
        notes: 'Potential tampering detected'
      },
      {
        id: '5',
        awbNumber: 'MY888999000',
        vendor: 'Myntra',
        platform: 'Fashion',
        returnDate: '2024-01-14',
        qcStatus: 'OK',
        cnStatus: 'Generated',
        cnNumber: 'CN2024002',
        amount: 2499,
        hasMedia: false,
        notes: 'Size issue return'
      },
      {
        id: '6',
        awbNumber: 'FK444555666',
        vendor: 'Flipkart',
        platform: 'E-commerce',
        returnDate: '2024-01-13',
        qcStatus: 'Damaged',
        cnStatus: 'Pending in SAP',
        hasMedia: true,
        notes: 'Packaging damaged during transit'
      }
    ]
    
    setReturnRecords(mockData)
  }, [])

  // Filter records based on selected filters
  useEffect(() => {
    let filtered = returnRecords

    // Date range filter
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.returnDate)
        const startDate = new Date(filters.startDate)
        const endDate = new Date(filters.endDate)
        return recordDate >= startDate && recordDate <= endDate
      })
    }

    // Vendor filter
    if (filters.vendor !== 'all') {
      filtered = filtered.filter(record => record.vendor === filters.vendor)
    }

    // Platform filter
    if (filters.platform !== 'all') {
      filtered = filtered.filter(record => record.platform === filters.platform)
    }

    // QC Status filter
    if (filters.qcStatus !== 'all') {
      filtered = filtered.filter(record => record.qcStatus === filters.qcStatus)
    }

    // CN Status filter
    if (filters.cnStatus !== 'all') {
      filtered = filtered.filter(record => record.cnStatus === filters.cnStatus)
    }

    setFilteredRecords(filtered)
  }, [returnRecords, filters])

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleRecordSelection = (recordId: string) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([])
    } else {
      setSelectedRecords(filteredRecords.map(record => record.id))
    }
  }

  const generateExcelReport = async () => {
    if (filteredRecords.length === 0) {
      toast.error('No records to export')
      return
    }

    setIsGenerating(true)

    try {
      // Prepare data for Excel
      const exportData = filteredRecords.map(record => ({
        'AWB Number': record.awbNumber,
        'Vendor': record.vendor,
        'Platform': record.platform,
        'Return Date': record.returnDate,
        'QC Status': record.qcStatus,
        'CN Status': record.cnStatus,
        'CN Number': record.cnNumber || '',
        'Amount': record.amount || '',
        'Has Media': record.hasMedia ? 'Yes' : 'No',
        'Notes': record.notes || ''
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Set column widths
      const colWidths = [
        { wch: 15 }, // AWB Number
        { wch: 12 }, // Vendor
        { wch: 15 }, // Platform
        { wch: 12 }, // Return Date
        { wch: 12 }, // QC Status
        { wch: 15 }, // CN Status
        { wch: 12 }, // CN Number
        { wch: 10 }, // Amount
        { wch: 10 }, // Has Media
        { wch: 30 }  // Notes
      ]
      ws['!cols'] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Returns Report')

      // Generate summary sheet
      const summary = [
        { Metric: 'Total Returns', Value: filteredRecords.length },
        { Metric: 'OK Status', Value: filteredRecords.filter(r => r.qcStatus === 'OK').length },
        { Metric: 'Damaged Status', Value: filteredRecords.filter(r => r.qcStatus === 'Damaged').length },
        { Metric: 'Suspicious Status', Value: filteredRecords.filter(r => r.qcStatus === 'Suspicious').length },
        { Metric: 'CN Generated', Value: filteredRecords.filter(r => r.cnStatus === 'Generated').length },
        { Metric: 'CN Pending', Value: filteredRecords.filter(r => r.cnStatus === 'Pending in SAP').length },
        { Metric: 'Total Amount', Value: filteredRecords.reduce((sum, r) => sum + (r.amount || 0), 0) },
        { Metric: 'Records with Media', Value: filteredRecords.filter(r => r.hasMedia).length }
      ]

      const summaryWs = XLSX.utils.json_to_sheet(summary)
      summaryWs['!cols'] = [{ wch: 20 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `returns-report-${timestamp}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)

      toast.success(`Report exported successfully: ${filename}`)
    } catch (error) {
      toast.error('Failed to generate report')
      console.error('Export error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSelectedReport = async () => {
    if (selectedRecords.length === 0) {
      toast.error('Please select records to export')
      return
    }

    const selectedData = filteredRecords.filter(record => selectedRecords.includes(record.id))
    
    setIsGenerating(true)

    try {
      const exportData = selectedData.map(record => ({
        'AWB Number': record.awbNumber,
        'Vendor': record.vendor,
        'Platform': record.platform,
        'Return Date': record.returnDate,
        'QC Status': record.qcStatus,
        'CN Status': record.cnStatus,
        'CN Number': record.cnNumber || '',
        'Amount': record.amount || '',
        'Has Media': record.hasMedia ? 'Yes' : 'No',
        'Notes': record.notes || ''
      }))

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)
      
      ws['!cols'] = [
        { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
        { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 30 }
      ]

      XLSX.utils.book_append_sheet(wb, ws, 'Selected Returns')

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `selected-returns-${timestamp}.xlsx`

      XLSX.writeFile(wb, filename)

      toast.success(`Selected records exported: ${filename}`)
      setSelectedRecords([])
    } catch (error) {
      toast.error('Failed to export selected records')
      console.error('Export error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Generate Report</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Configure filters to generate customized reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Select value={filters.vendor} onValueChange={(value) => handleFilterChange('vendor', value)}>
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
                <Label>Platform</Label>
                <Select value={filters.platform} onValueChange={(value) => handleFilterChange('platform', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="Social Commerce">Social Commerce</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>QC Status</Label>
                <Select value={filters.qcStatus} onValueChange={(value) => handleFilterChange('qcStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All QC Status</SelectItem>
                    <SelectItem value="OK">OK</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                    <SelectItem value="Suspicious">Suspicious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>CN Status</Label>
                <Select value={filters.cnStatus} onValueChange={(value) => handleFilterChange('cnStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All CN Status</SelectItem>
                    <SelectItem value="Generated">Generated</SelectItem>
                    <SelectItem value="Pending in SAP">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
                <p className="text-sm text-gray-600">Total Records</p>
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
                  {filteredRecords.filter(r => r.cnStatus === 'Generated').length}
                </p>
                <p className="text-sm text-gray-600">CN Generated</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  ₹{filteredRecords.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Generate Excel reports with filtered data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={generateExcelReport} 
                disabled={isGenerating || filteredRecords.length === 0}
                className="flex-1 sm:flex-none"
              >
                {isGenerating ? 'Generating...' : 'Export All Records'}
              </Button>
              
              <Button 
                onClick={generateSelectedReport} 
                variant="outline"
                disabled={isGenerating || selectedRecords.length === 0}
                className="flex-1 sm:flex-none"
              >
                Export Selected ({selectedRecords.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Return Records ({filteredRecords.length})</CardTitle>
            <CardDescription>
              Select records to include in custom reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>AWB Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>QC Status</TableHead>
                    <TableHead>CN Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Media</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={() => toggleRecordSelection(record.id)}
                        />
                      </TableCell>
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
                      <TableCell>{getStatusBadge(record.qcStatus, 'qc')}</TableCell>
                      <TableCell>{getStatusBadge(record.cnStatus, 'cn')}</TableCell>
                      <TableCell>
                        {record.amount ? `₹${record.amount.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.hasMedia ? "default" : "secondary"}>
                          {record.hasMedia ? 'Yes' : 'No'}
                        </Badge>
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
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
