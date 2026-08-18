import logo from '../assets/logo.png'

export default function Logo() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <img src={logo} alt="Рекрут" />
      </span>
      <span className="brand-copy">
        <strong>Рекрут</strong>
        <small>подбор персонала</small>
      </span>
    </span>
  )
}
