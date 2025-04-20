import React from 'react'

interface StepIndicatorProps {
    currentStep: number
    totalSteps: number
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index + 1 <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`w-10 h-1 ${index + 1 < currentStep ? "bg-primary" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default StepIndicator