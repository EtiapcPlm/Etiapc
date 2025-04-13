# ETIAPC PLM - Sistema de Gestión de Acompañamiento Docente

Sistema de gestión para el seguimiento y acompañamiento docente en el marco del Programa de Liderazgo y Mejora de la Educación (PLM).

## Características Principales

- Autenticación con Google y credenciales locales
- Gestión de roles (Docente, Coordinador, Administrador)
- Sistema de acompañamiento docente
- Evaluaciones y seguimiento
- Dashboard con métricas y estadísticas
- Notificaciones en tiempo real

## Requisitos Previos

- Node.js 18.x o superior
- MongoDB Atlas o MongoDB local
- Cuenta de Google para OAuth
- Cuenta de Gmail para notificaciones

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/etiapc-plm.git
cd etiapc-plm
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```
Editar `.env.local` con tus credenciales.

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── app/              # Rutas y páginas de Next.js
├── components/       # Componentes React
├── models/          # Modelos de MongoDB
├── types/           # Definiciones de TypeScript
├── utils/           # Utilidades y helpers
└── lib/             # Configuraciones y servicios
```

## Despliegue

### Vercel (Recomendado)

1. Crear una cuenta en [Vercel](https://vercel.com)
2. Conectar con tu repositorio de GitHub
3. Configurar las variables de entorno
4. Desplegar

### Configuración de Producción

- Asegúrate de configurar las siguientes variables de entorno:
  - `MONGODB_URI`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `EMAIL_USER`
  - `EMAIL_PASS`

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para soporte o consultas, contactar a:
- Email: soporte@etiapc.edu.ar
- Sitio web: [www.etiapc.edu.ar](https://www.etiapc.edu.ar)
