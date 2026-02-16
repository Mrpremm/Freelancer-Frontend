import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Loader } from 'lucide-react'

const schema = yup.object({
  requirements: yup.string().required('Requirements are required').max(1000, 'Requirements cannot exceed 1000 characters'),
})

const CreateOrderForm = ({ gig, onSubmit, onCancel, loading = false }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
  })

  const requirements = watch('requirements')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Service</span>
            <span className="font-medium">{gig.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price</span>
            <span className="font-bold text-lg text-primary-600">${gig.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Time</span>
            <span>{gig.deliveryTime} days</span>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Requirements *
          <span className="text-gray-500 ml-2">
            Tell the freelancer what you need
          </span>
        </label>
        <textarea
          {...register('requirements')}
          rows={6}
          className="input-field"
          placeholder="Describe what you need in detail. Include any specific requirements, deadlines, or preferences..."
        />
        {errors.requirements && (
          <p className="text-red-500 text-sm mt-2">{errors.requirements.message}</p>
        )}
        <div className="text-right text-sm text-gray-500 mt-2">
          {requirements?.length || 0}/1000 characters
        </div>
      </div>

      {/* Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-yellow-800 text-sm">
          <p className="font-medium mb-1">Important:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Be clear and specific about your requirements</li>
            <li>Include any files or references if needed</li>
            <li>Payment will be released only after you accept the delivery</li>
            <li>You can request revisions based on the gig's terms</li>
          </ul>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline px-6"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8 flex items-center"
        >
          {loading && <Loader className="animate-spin mr-2" size={20} />}
          Place Order (${gig.price})
        </button>
      </div>
    </form>
  )
}

export default CreateOrderForm