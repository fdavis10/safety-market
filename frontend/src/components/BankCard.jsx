import { useLocale } from '../i18n/LocaleContext'

function brandFromNumber(number) {
  const digits = number.replace(/\s/g, '')
  if (digits.startsWith('4')) return 'Visa'
  if (/^220[0-4]/.test(digits)) return 'Мир'
  if (/^5[1-5]/.test(digits)) return 'Mastercard'
  if (digits.startsWith('2')) return 'Мир'
  return 'CARD'
}

export default function BankCard({ form, setField }) {
  const brand = brandFromNumber(form.card_number)
  const { t } = useLocale()

  return (
    <div className="bank-card-wrap">
      <div className="bank-card">
        <div className="bank-card-inner">
          <div className="bank-card-face front">
            <div className="bank-card-top">
              <span className="bank-chip" aria-hidden="true" />
              <span className="bank-brand">{brand}</span>
            </div>
            <label className="bank-number">
              <span className="sr-only">{t('bank.number')}</span>
              <input
                required
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="•••• •••• •••• ••••"
                value={form.card_number}
                onChange={(e) => setField('card_number', e.target.value)}
              />
            </label>
            <div className="bank-front-row">
              <label>
                <span>{t('bank.holder')}</span>
                <input
                  required
                  autoComplete="cc-name"
                  placeholder="IVAN PETROV"
                  value={form.card_holder}
                  onChange={(e) => setField('card_holder', e.target.value)}
                />
              </label>
              <label className="bank-expiry">
                <span>{t('bank.expiry')}</span>
                <input
                  required
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  value={form.card_expiry}
                  onChange={(e) => setField('card_expiry', e.target.value)}
                />
              </label>
              <label className="bank-cvv">
                <span>{t('bank.cvv')}</span>
                <input
                  required
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength="4"
                  placeholder="•••"
                  value={form.card_cvv}
                  onChange={(e) => setField('card_cvv', e.target.value)}
                />
              </label>
            </div>
            <p className="bank-back-copy">{t('bank.note')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
