import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react'

const OrderStatus = ({ status }) => {
  const steps = [
    { key: 'Pending', icon: Clock, label: 'Pending', color: 'text-yellow-500' },
    { key: 'In Progress', icon: Package, label: 'In Progress', color: 'text-blue-500' },
    { key: 'Delivered', icon: Truck, label: 'Delivered', color: 'text-purple-500' },
    { key: 'Completed', icon: CheckCircle, label: 'Completed', color: 'text-green-500' },
    { key: 'Cancelled', icon: XCircle, label: 'Cancelled', color: 'text-red-500' }
  ]

  const currentStepIndex = steps.findIndex(step => step.key === status)
  const currentStep = steps[currentStepIndex]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center relative">
            {/* Connection line */}
            {index > 0 && (
              <div className={`absolute h-1 w-full -left-1/2 top-4 -z-10 ${
                index <= currentStepIndex ? 'bg-primary-500' : 'bg-gray-200'
              }`}></div>
            )}
            
            {/* Icon */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center mb-2
              ${index <= currentStepIndex ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'}
            `}>
              <step.icon size={20} />
            </div>
            
            {/* Label */}
            <span className={`
              text-sm font-medium
              ${index <= currentStepIndex ? 'text-primary-600' : 'text-gray-500'}
            `}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Current status info */}
      {currentStep && (
        <div className={`p-4 rounded-lg ${currentStep.color.replace('text-', 'bg-')} bg-opacity-10`}>
          <div className="flex items-center">
            <currentStep.icon className={`mr-3 ${currentStep.color}`} size={24} />
            <div>
              <h4 className="font-semibold">Status: {currentStep.label}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {getStatusDescription(status)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const getStatusDescription = (status) => {
  const descriptions = {
    'Pending': 'Your order has been placed and is waiting for the freelancer to accept.',
    'In Progress': 'The freelancer is working on your order.',
    'Delivered': 'The order has been delivered. Please review the work.',
    'Completed': 'The order has been completed successfully.',
    'Cancelled': 'This order has been cancelled.'
  }
  return descriptions[status] || 'Order status information'
}

export default OrderStatus