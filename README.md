# SmartReturn B2C - Internal Returns Management System

A comprehensive web application for managing B2C returns in the Sale Return Department, featuring barcode scanning, AI-powered quality control, and automated reporting.

## Features

### 🔍 Barcode Scanning
- Real-time barcode scanning using device camera
- Automatic vendor identification (Flipkart, Meesho, Amazon, etc.)
- Instant return logging with timestamp

### 🤖 AI-Powered QC Tagging
- TensorFlow.js-based damage detection
- Client-side AI processing (no API keys required)
- Manual override capability for quality control staff
- Confidence scoring for AI predictions

### 📸 Media Upload System
- Photo and video upload support
- Drag-and-drop interface
- Special requirements for Meesho returns
- File preview and management

### 📊 CN Status Tracking
- Real-time credit note status monitoring
- Integration with SAP system workflow
- View-only access to CN generation process

### 📈 Advanced Reporting
- Excel export with SheetJS integration
- Customizable filters and date ranges
- Summary statistics and analytics
- Bulk and selective data export

### 📋 Complete Return History
- Comprehensive audit trail
- Staff activity tracking
- Detailed record views with modal dialogs

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **AI/ML**: TensorFlow.js for client-side processing
- **Barcode Scanning**: html5-qrcode library
- **Database**: Firebase Firestore (configured)
- **File Storage**: Firebase Storage (configured)
- **Authentication**: Firebase Auth (configured)
- **Excel Export**: SheetJS (xlsx)
- **Notifications**: Sonner toast library

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartreturn-b2c
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Firebase configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:8000
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_APP_NAME=SmartReturn B2C
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── cn-status/         # Credit Note status tracking
│   ├── history/           # Return history and audit trail
│   ├── qc/                # AI-powered QC tagging
│   ├── report/            # Report generation and export
│   ├── scan/              # Barcode scanning interface
│   ├── upload/            # Media file upload system
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Dashboard homepage
├── components/ui/         # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   ├── tfqc.ts           # TensorFlow.js QC integration
│   └── utils.ts          # General utilities
└── styles/               # Global styles and Tailwind config
```

## Key Features Explained

### Barcode Scanner
- Uses `html5-qrcode` for cross-platform camera access
- Automatic vendor detection based on barcode patterns
- Real-time scanning with visual feedback

### AI Quality Control
- TensorFlow.js runs entirely in the browser
- Pre-trained model for damage detection
- Three classification categories: OK, Damaged, Suspicious
- Manual override system for quality control staff

### Media Upload
- Support for images (JPG, PNG, WEBP) and videos (MP4, MOV, AVI)
- 50MB file size limit per file
- Special workflow for Meesho returns requiring video documentation
- Drag-and-drop interface with preview capabilities

### Reporting System
- Excel export using SheetJS library
- Multiple filter options (date, vendor, status, etc.)
- Summary statistics and analytics
- Bulk export and selective record export

### Firebase Integration
- Firestore for real-time data storage
- Firebase Storage for media files
- Firebase Auth for user authentication
- Offline capability with local caching

## User Roles

### Return Executive
- Scan returned items
- Log basic return information
- Upload media files as required

### QC Staff
- Perform quality control assessments
- Use AI-assisted tagging with manual override
- Review suspicious items
- Generate quality reports

### Admin (Future Enhancement)
- Access to all system logs
- User management
- System configuration
- Advanced analytics

## Workflow

1. **Return Scanning**: Staff scans barcode to identify vendor and log return
2. **Quality Control**: AI analyzes product images, staff can override if needed
3. **Media Upload**: Upload photos/videos, especially for Meesho returns
4. **CN Processing**: System sends data to SAP for credit note generation
5. **Status Tracking**: Monitor CN status and completion
6. **Reporting**: Generate Excel reports for management review

## Browser Compatibility

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Camera access required for barcode scanning and QC image capture.

## Performance Optimizations

- TensorFlow.js model lazy loading
- Image compression for uploads
- Efficient data pagination
- Client-side caching
- Optimized bundle splitting

## Security Features

- Firebase Authentication integration
- Role-based access control
- Secure file upload validation
- Data encryption in transit
- Audit trail for all actions

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t smartreturn-b2c .
docker run -p 3000:3000 smartreturn-b2c
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software for internal use only.

## Support

For technical support or feature requests, please contact the development team.

---

**SmartReturn B2C** - Streamlining returns management with AI-powered automation.
