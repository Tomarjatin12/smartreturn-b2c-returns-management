"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Logo from '@/components/Logo'
import Link from 'next/link'

export default function WebsitePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      title: "Universal Barcode Scanning",
      description: "Scan any barcode format - QR codes, UPC, EAN, Code 128, and more. Automatic vendor identification for Flipkart, Meesho, Amazon, and other platforms.",
      icon: "📱",
      benefits: ["All barcode formats supported", "Instant vendor detection", "Mobile-optimized scanning"]
    },
    {
      title: "AI-Powered Quality Control",
      description: "Advanced TensorFlow.js integration provides real-time damage detection with manual override capabilities for quality control staff.",
      icon: "🤖",
      benefits: ["Real-time AI analysis", "Manual override option", "Confidence scoring"]
    },
    {
      title: "Smart Media Management",
      description: "Upload and manage photos and videos with special workflows for Meesho returns. Drag-and-drop interface with preview capabilities.",
      icon: "📸",
      benefits: ["Drag-and-drop upload", "Video documentation", "File preview system"]
    },
    {
      title: "Advanced Reporting",
      description: "Generate comprehensive Excel reports with filtering, analytics, and export capabilities. Integration with SAP for CN status tracking.",
      icon: "📊",
      benefits: ["Excel export", "Real-time analytics", "SAP integration"]
    }
  ]

  const stats = [
    { label: "Processing Time Reduction", value: "75%", description: "Faster return processing" },
    { label: "Accuracy Improvement", value: "95%", description: "AI-assisted quality control" },
    { label: "Cost Savings", value: "60%", description: "Reduced manual effort" },
    { label: "User Satisfaction", value: "98%", description: "Staff approval rating" }
  ]

  const workflow = [
    { step: "1", title: "Scan Return", description: "Scan barcode to identify vendor and log return automatically" },
    { step: "2", title: "QC Analysis", description: "AI analyzes product condition with manual override option" },
    { step: "3", title: "Media Upload", description: "Upload photos/videos for documentation (required for Meesho)" },
    { step: "4", title: "CN Processing", description: "System sends data to SAP for credit note generation" },
    { step: "5", title: "Track & Report", description: "Monitor status and generate comprehensive reports" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" showText={true} />
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#workflow" className="text-gray-600 hover:text-gray-900 transition-colors">Workflow</a>
                <a href="#stats" className="text-gray-600 hover:text-gray-900 transition-colors">Results</a>
              </nav>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                Internal Returns Management System
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Revolutionize Your
                <span className="text-blue-600 block">B2C Returns</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your returns department with AI-powered automation, universal barcode scanning, 
                and comprehensive reporting. Built specifically for internal teams handling B2C returns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                    Start Processing Returns
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  View Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Logo size="sm" showText={false} />
                    <div>
                      <h3 className="font-semibold">Return Processing</h3>
                      <p className="text-sm text-gray-600">Live Dashboard</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-blue-600">24</p>
                      <p className="text-xs text-gray-600">Today's Returns</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-green-600">16</p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>AI Processing</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Returns Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to automate and optimize your B2C returns process
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFeature === index 
                      ? 'border-blue-500 shadow-lg bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{feature.icon}</span>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  {activeFeature === index && (
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/960322fd-632a-4c09-a974-50fc43426f6a.png"
                alt="SmartReturn B2C Dashboard Interface"
                className="w-full rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.onerror = null
                  target.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1928c6a8-d492-4f75-9a74-ef303b37b3e2.png"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Streamlined 5-Step Process
            </h2>
            <p className="text-xl text-gray-600">
              From scanning to reporting - complete automation in 5 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {workflow.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    {item.step}
                  </div>
                  {index < workflow.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 -translate-y-0.5"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Proven Results
            </h2>
            <p className="text-xl text-blue-100">
              Real impact on returns processing efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-blue-100 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-blue-200">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Logo size="lg" variant="light" showText={true} />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 mt-8">
            Ready to Transform Your Returns Process?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the future of B2C returns management with AI-powered automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Launch SmartReturn B2C
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-gray-600 text-gray-300 hover:bg-gray-800">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" variant="light" showText={true} />
              <p className="text-gray-400 mt-4 text-sm">
                Internal B2C returns management system for the Sale Return Department.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Barcode Scanning</li>
                <li>AI Quality Control</li>
                <li>Media Management</li>
                <li>Report Generation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Documentation</li>
                <li>Training</li>
                <li>Technical Support</li>
                <li>System Status</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 SmartReturn B2C. All rights reserved. Internal use only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
