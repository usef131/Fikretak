import { Modal, Button, Spinner } from 'react-bootstrap'

const VARIANTS = {
  danger:  { bg: '#fee2e2', color: '#dc2626', icon: 'bi-trash3-fill' },
  warning: { bg: '#fef3c7', color: '#b45309', icon: 'bi-exclamation-triangle-fill' },
  primary: { bg: '#e0e7ff', color: '#4338ca', icon: 'bi-question-circle-fill' },
}

/**
 * Reusable confirmation dialog to replace native window.confirm().
 * Controlled via `show`; call onConfirm / onCancel to resolve.
 */
export default function ConfirmDialog({
  show,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  const v = VARIANTS[variant] || VARIANTS.danger

  return (
    <Modal show={show} onHide={loading ? undefined : onCancel} centered size="sm" backdrop="static">
      <Modal.Body className="text-center p-4">
        <div
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: v.bg, color: v.color, fontSize: '1.35rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <i className={`bi ${v.icon}`} />
        </div>

        <h5 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{title}</h5>

        {message && (
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: error ? '0.6rem' : '1.25rem' }}>
            {message}
          </p>
        )}

        {error && (
          <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1.25rem' }}>{error}</p>
        )}

        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant="light"
            onClick={onCancel}
            disabled={loading}
            style={{ borderRadius: 999, fontWeight: 600, minWidth: 100, border: '1px solid #e5e7eb' }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={loading}
            style={{ borderRadius: 999, fontWeight: 600, minWidth: 100 }}
          >
            {loading ? <Spinner size="sm" /> : confirmLabel}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
