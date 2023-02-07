import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"

type ToastContext = {
  toasts: string[]
  addToasts: (toast: string) => void
}

const ToastContext = createContext({} as ToastContext)

export function useToast() {
  return useContext(ToastContext)
}

type ToastProviderProps = {
  children: ReactNode
}

function ToastComponent({ message }: { message: string }) {
  const toastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!toastRef) return;

    setTimeout(() => {
      toastRef.current?.remove()
    }, 1234)
  }, [toastRef])

  return (
    <div ref={toastRef} className="alert alert-success">
      <div>
        <span>{message}</span>
      </div>
    </div>

  )
}
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<string[]>([])

  function addToasts(toast: string) {
    setToasts(currentToasts => [...currentToasts, toast])
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToasts
      }}
    >
      {!!toasts.length && (
        <div className="toast toast-top toast-end">
          {toasts.map((toast, idx) => <ToastComponent key={idx} message={toast} />)}
        </div>
      )}
      {children}
    </ToastContext.Provider>
  )
}
