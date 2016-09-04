// let currentLang = 'en'

// export function setLanguage(id) {
//   currentLang = id;
// }
// export function t(text) {
//   return (translations[currentLang] && translations[currentLang][text]) || text;
// }

const translations = {
  en : {
    english: 'English',
    trolleyRoutes: 'Trolley Routes',
    showAll: 'Show All',
    loading: 'Loading',
    bikes: 'Bikes',
    defaultRoutes: 'Default Routes',
    vehicleTime: 'Vehicle ID - Time (min)',
    language: 'Language',
    helpText: {
      trolley: 'Tap a trolley icon to see its ID',
      menuButton: 'Tap the orange menu button at the top left to toggle routes',
      stops: 'Tap a stop to see when the next Trolley is estimated to arrive'
    },
    inService: 'In Service',
    outOfService: 'Out of Service'
  },
  es: {
    english: 'Inglés',
    trolleyRoutes: 'Rutas de Trolley',
    showAll: 'Todos',
    loading: 'Cargando',
    bikes: 'Bicicletas',
    defaultRoutes: 'Rutas Favoritas',
    vehicleTime: 'Vehículo ID - Tiempo (min)',
    language: 'Idioma',
    helpText: {
      trolley: 'Toque el ícono del trolley para ver su ID',
      menuButton: 'Toque el botón de menu anaranjado en la esquina superior izquierda para elegir las rutas',
      stops: 'Toque una parada para ver el tiempo estimado de arribo para el siguiente trolley'
    },
    inService: 'En Servicio',
    outOfService: 'Fuera de Servicio'
  }
}

export default translations