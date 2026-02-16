import { createContext, useContext } from 'react'
import toast from 'react-hot-toast'

export const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const showSuccess = (message) => toast.success(message)
  const showError = (message) => toast.error(message)
  const showInfo = (message) => toast(message)
  const showLoading = (message) => toast.loading(message)

  const value = {
    showSuccess,
    showError,
    showInfo,
    showLoading,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}