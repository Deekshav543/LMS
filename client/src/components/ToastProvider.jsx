/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function useToasts() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((type, message) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
  }

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="lf-toast-container">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`lf-toast lf-toast-${t.type}`}
            role="alert"
          >
            {icons[t.type] || icons.info}
            <span style={{ flex: 1, fontSize: 14 }}>{t.message}</span>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', opacity: 0.8, display: 'flex' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
