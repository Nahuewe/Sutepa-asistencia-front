export const VotoUsuario = ({ respuesta }) => (
  <div
    className={`text-center mt-4 font-semibold text-lg ${
        respuesta === 'afirmativo'
          ? 'text-green-600'
          : respuesta === 'negativo'
            ? 'text-red-600'
            : 'text-cyan-600'
      }`}
  >
    Tu voto fue: {respuesta.charAt(0).toUpperCase() + respuesta.slice(1)}
  </div>
)
