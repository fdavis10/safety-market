import logo from '../assets/logo.png'

export default function Logo() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <img src={logo} alt="Р ПЛЮС" />
      </span>
      <span className="brand-copy">
        <strong>Р ПЛЮС</strong>
        <small>подбор персонала</small>
      </span>
    </span>
  )
}
