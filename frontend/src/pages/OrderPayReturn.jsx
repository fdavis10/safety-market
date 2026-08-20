import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { useLocale } from '../i18n/LocaleContext'

export default function OrderPayReturn() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useLocale()
  const [state, setState] = useState({ kind: 'loading', message: '' })
  const failedHint = searchParams.get('failed') === '1'

  useEffect(() => {
    let cancelled = false

    async function confirm() {
      try {
        const order = await api(`/api/orders/${id}/confirm/`, { method: 'POST', body: {} })
        if (cancelled) return
        if (order.status === 'paid') {
          navigate(`/order/${id}`, { replace: true, viewTransition: true })
          return
        }
        if (order.status === 'failed' || failedHint) {
          setState({ kind: 'failed', message: t('order.failed') })
          return
        }
        setState({ kind: 'pending', message: t('order.pending') })
      } catch (err) {
        if (!cancelled) {
          setState({ kind: 'failed', message: err.message || t('order.failed') })
        }
      }
    }

    confirm()
    return () => {
      cancelled = true
    }
  }, [id, navigate, t, failedHint])

  if (state.kind === 'loading') {
    return <section className="section container">{t('order.checking')}</section>
  }

  const isFailed = state.kind === 'failed'
  return (
    <section className="section">
      <div className="container success">
        <h1>{isFailed ? t('order.failedTitle') : t('order.pendingTitle')}</h1>
        <p>{state.message}</p>
        {!isFailed && (
          <Link to={`/order/${id}/pay`} className="btn btn-gold" viewTransition>
            {t('order.checkAgain')}
          </Link>
        )}
        {isFailed && (
          <Link to="/checkout" className="btn btn-gold" viewTransition>
            {t('order.retry')}
          </Link>
        )}
        <Link to="/" className="btn btn-navy" viewTransition>
          {t('order.home')}
        </Link>
      </div>
    </section>
  )
}
