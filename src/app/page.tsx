"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Logo from '@/components/Logo'
import Link from 'next/link'

export default function Dashboard() {
  const [user] = useState({ name: 'Return Executive', role: 'QC Staff' })

  const stats = [
    { label: 'Today\'s Returns', value: '24', color: 'bg-blue-500' },
    { label: 'Pending QC', value: '8', color: 'bg-yellow-500' },
    { label: 'Completed', value: '16', color: 'bg-green-500' },
    { label: 'Damaged Items', value: '3', color: 'bg-red-500' },
  ]

  const quickActions = [
    { title: 'Scan Return', description: 'Scan barcode to log new return', href: '/scan', color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'QC Tagging', description: 'AI-assisted quality check', href: '/qc', color: 'bg-green-600 hover:bg-green-700' },
    { title: 'Upload Media', description: 'Upload photos/videos for Meesho', href: '/upload', color: 'bg-purple-600 hover:bg-purple-700' },
    { title: 'CN Status', description: 'View credit note status', href: '/cn-status', color: 'bg-orange-600 hover:bg-orange-700' },
    { title: 'Generate Report', description: 'Export daily master sheet', href: '/report', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { title: 'Return History', description: 'View all logged returns', href: '/history', color: 'bg-gray-600 hover:bg-gray-700' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo size="sm" showText={true} />
              <Link href="/website" className="text-sm text-blue-600 hover:text-blue-800">
                About SmartReturn B2C
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{user.role}</Badge>
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${stat.color} mr-3`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                      <div className="w-6 h-6 bg-white rounded"></div>
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest return processing activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '10:30 AM', action: 'Return scanned', details: 'Flipkart - AWB: FK123456789', status: 'OK' },
                { time: '10:15 AM', action: 'QC completed', details: 'Meesho - AWB: MS987654321', status: 'Damaged' },
                { time: '09:45 AM', action: 'Video uploaded', details: 'Meesho - AWB: MS555666777', status: 'Pending' },
                { time: '09:30 AM', action: 'Return scanned', details: 'Amazon - AWB: AM111222333', status: 'OK' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">{activity.time}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={activity.status === 'OK' ? 'default' : activity.status === 'Damaged' ? 'destructive' : 'secondary'}
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
