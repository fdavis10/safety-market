import { useRef } from 'react'

function brandFromNumber(number) {
  const digits = number.replace(/\s/g, '')
  if (digits.startsWith('4')) return 'Visa'
  if (/^220[0-4]/.test(digits)) return 'Мир'
  if (/^5[1-5]/.test(digits)) return 'Mastercard'
  if (digits.startsWith('2')) return 'Мир'
  return 'CARD'
}

export default function BankCard({ form, setField, flipped, setFlipped }) {
  const cvvRef = useRef(null)
  const numberRef = useRef(null)
  const brand = brandFromNumber(form.card_number)

  function showBack() {
    setFlipped(true)
    window.setTimeout(() => cvvRef.current?.focus(), 420)
  }

  function showFront() {
    setFlipped(false)
    window.setTimeout(() => numberRef.current?.focus(), 420)
  }

  return (
    <div className="bank-card-wrap">
      <p className="muted bank-card-note">Другие способы недоступны.</p>
      <div className={`bank-card ${flipped ? 'is-flipped' : ''}`}>
        <div className="bank-card-inner">
          <div className="bank-card-face front" inert={flipped ? '' : undefined}>
            <div className="bank-card-top">
              <span className="bank-chip" aria-hidden="true" />
              <span className="bank-brand">{brand}</span>
            </div>
            <label className="bank-number">
              <span className="sr-only">Номер карты</span>
              <input
                ref={numberRef}
                required
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="•••• •••• •••• ••••"
                value={form.card_number}
                onFocus={() => setFlipped(false)}
                onChange={(e) => setField('card_number', e.target.value)}
              />
            </label>
            <div className="bank-front-row">
              <label>
                <span>Держатель</span>
                <input
                  required
                  autoComplete="cc-name"
                  placeholder="IVAN PETROV"
                  value={form.card_holder}
                  onFocus={() => setFlipped(false)}
                  onChange={(e) => setField('card_holder', e.target.value)}
                />
              </label>
              <label className="bank-expiry">
                <span>Срок</span>
                <input
                  required
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  value={form.card_expiry}
                  onFocus={() => setFlipped(false)}
                  onChange={(e) => {
                    setField('card_expiry', e.target.value)
                    const expiryDigits = e.target.value.replace(/\D/g, '')
                    const panDigits = form.card_number.replace(/\D/g, '')
                    if (expiryDigits.length === 4 && panDigits.length >= 13) showBack()
                  }}
                />
              </label>
            </div>
            <button type="button" className="bank-flip-hint" onClick={showBack}>
              Перевернуть для CVV
            </button>
          </div>

          <div className="bank-card-face back" inert={flipped ? undefined : ''}>
            <div className="bank-stripe" />
            <div className="bank-sign-row">
              <div className="bank-sign" aria-hidden="true">
                {form.card_holder || 'authorized signature'}
              </div>
              <label className="bank-cvv">
                <span>CVV</span>
                <input
                  ref={cvvRef}
                  required
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength="4"
                  placeholder="•••"
                  value={form.card_cvv}
                  onFocus={() => setFlipped(true)}
                  onChange={(e) => setField('card_cvv', e.target.value)}
                />
              </label>
            </div>
            <p className="bank-back-copy">Код на полосе подписи. Мы не сохраняем CVV после оплаты.</p>
            <button type="button" className="bank-flip-hint" onClick={showFront}>
              Вернуть на лицевую сторону
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
