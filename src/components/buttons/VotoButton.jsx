export const VotoButton = ({ texto, color, onClick, disabled }) => {
  return (
    <button
      className={`${color} disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition`}
      onClick={onClick}
      disabled={disabled}
    >
      {texto}
    </button>
  )
}
