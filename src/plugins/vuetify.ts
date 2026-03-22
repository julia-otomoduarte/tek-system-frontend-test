import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { pt } from 'vuetify/locale'

export default createVuetify({
  components,
  directives,
  locale: {
    locale: 'pt',
    messages: { pt },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#111536',
          secondary: '#761C1E',
          accent: '#761C1E',
          background: '#F4F4F4',
          surface: '#FFFFFF',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          success: '#4CAF50',
          error: '#F44336',
          warning: '#FF9800',
          info: '#414670',
        },
      },
    },
  },
})
