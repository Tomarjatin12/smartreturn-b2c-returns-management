"use client"

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'light' | 'dark'
  showText?: boolean
}

export default function Logo({ size = 'md', variant = 'dark', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  }

  const iconColor = variant === 'light' ? 'text-white' : 'text-gray-900'
  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900'

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} ${iconColor} relative`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Circle - Return Symbol */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="opacity-20"
          />
          
          {/* Return Arrow */}
          <path
            d="M25 35 L35 25 L35 30 L65 30 L65 40 L35 40 L35 45 Z"
            fill="currentColor"
            className="opacity-80"
          />
          
          {/* Smart/AI Brain Symbol */}
          <circle cx="50" cy="60" r="12" fill="currentColor" className="opacity-60" />
          <circle cx="45" cy="57" r="2" fill="white" />
          <circle cx="55" cy="57" r="2" fill="white" />
          <path
            d="M45 65 Q50 68 55 65"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* B2C Indicator */}
          <rect
            x="70"
            y="15"
            width="20"
            height="8"
            rx="4"
            fill="currentColor"
            className="opacity-90"
          />
          <text
            x="80"
            y="21"
            textAnchor="middle"
            className="text-[6px] fill-white font-bold"
          >
            B2C
          </text>
          
          {/* Data Flow Lines */}
          <path
            d="M20 70 Q30 75 40 70 Q50 65 60 70 Q70 75 80 70"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="opacity-40"
            strokeDasharray="3,2"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className={`${textColor}`}>
          <h1 className={`${textSizeClasses[size]} font-bold leading-tight`}>
            Smart<span className="text-blue-600">Return</span>
          </h1>
          <p className={`text-xs ${variant === 'light' ? 'text-gray-200' : 'text-gray-600'} font-medium tracking-wide`}>
            B2C RETURNS
          </p>
        </div>
      )}
    </div>
  )
}
