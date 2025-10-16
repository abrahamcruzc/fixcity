# 🏙️ FixCity - Plataforma de Gestión de Problemas Urbanos -

<div align="center">

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/react--native-0.81+-blue.svg)](https://reactnative.dev/)
[![MongoDB](https://img.shields.io/badge/mongodb-7.0+-green.svg)](https://www.mongodb.com/)
[![Expo](https://img.shields.io/badge/expo-49+-lightgrey.svg)](https://expo.dev/)
</div>

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [Instalación y Setup](#-instalación-y-setup)
- [Desarrollo](#-desarrollo)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Documentation](#-api-documentation)
- [Reglas de Contribución](#-reglas-de-contribución)
- [Flujo de Git](#-flujo-de-git)
- [Scripts Disponibles](#-scripts-disponibles)
- [Deploy y Producción](#-deploy-y-producción)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contribuidores](#-contribuidores)
- [Licencia](#-licencia)

## 📖 Descripción del Proyecto

**FixCity** es una plataforma digital innovadora diseñada para mejorar la gestión y resolución de problemas urbanos. Facilita la comunicación entre ciudadanos y autoridades municipales, permitiendo el reporte, seguimiento y resolución eficiente de incidencias urbanas.

### 🎯 Objetivo Principal
Crear un puente digital entre la ciudadanía y las administraciones municipales para:
- Reportar problemas urbanos de manera rápida y precisa
- Gestionar incidencias con seguimiento en tiempo real
- Generar analíticas para toma de decisiones basada en datos
- Mejorar la calidad de vida urbana mediante tecnología

### 🌟 Casos de Uso
- **Ciudadanos**: Reportar baches, fallas de alumbrado, acumulación de basura, fugas de agua
- **Autoridades**: Gestionar, priorizar y asignar recursos para resolución de incidencias
- **Administradores**: Analizar patrones, generar reportes y optimizar procesos

## ✨ Características Principales

### 📱 Aplicación Móvil (Ciudadanos)
- ✅ Reporte de incidencias con geolocalización automática
- ✅ Captura de fotografías y descripción detallada
- ✅ Seguimiento en tiempo real del estado de reportes
- ✅ Notificaciones push sobre actualizaciones
- ✅ Mapa interactivo de incidencias en la zona
- ✅ Historial personal de reportes

### 💻 Panel de Administración (Autoridades)
- ✅ Dashboard ejecutivo con métricas en tiempo real
- ✅ Gestión completa de incidencias y asignación de recursos
- ✅ Sistema de comentarios internos y seguimiento
- ✅ Reportes analíticos y identificación de zonas críticas
- ✅ Gestión de usuarios y roles
- ✅ Exportación de datos y métricas de rendimiento

### 🔧 Backend API
- ✅ API RESTful con autenticación JWT
- ✅ Gestión de archivos con Firebase Storage
- ✅ Sistema de notificaciones push automáticas
- ✅ Procesamiento de analíticas y generación de reportes
- ✅ Middleware de seguridad y validación de datos

### 🛠️ Stack Tecnológico

### 🛠️ Stack Tecnológico

#### 📱 **Frontend Móvil**
- **React Native**: 0.81.0 + Expo SDK 49
- **Navegación**: React Navigation 6.x
- **HTTP Client**: Axios 1.11.0
- **Gestión de Estado**: React Hooks + Context API

#### 🖥️ **Panel de Administración**
- **React**: 18.2.0 + Vite
- **UI Framework**: Material-UI (MUI) 5.x
- **Enrutamiento**: React Router DOM 6.x
- **Iconos**: MUI Icons

#### ⚙️ **Backend API**
- **Node.js**: 18.17.0+
- **Express.js**: 4.18.2+
- **Base de Datos**: MongoDB 7.0+ con Mongoose 8.x
- **Autenticación**: JWT + bcryptjs
- **Validación**: express-validator

#### 🗄️ **Base de Datos & Almacenamiento**
- **MongoDB**: 7.0+ (Atlas/Community)
- **ODM**: Mongoose 8.0.3
- **Almacenamiento**: Firebase Storage
- **Caché**: Redis 7+

#### 🔔 **Servicios & Utilidades**
- **Notificaciones**: Firebase Cloud Messaging
- **Email**: Nodemailer
- **Proxy Inverso**: Nginx
- **Contenedores**: Docker + Docker Compose
- **Variables de Entorno**: dotenv

#### 🧪 **Testing & Calidad**
- **Testing**: Jest 29.x + Supertest
- **Linting**: ESLint + Prettier

## 🚀 Instalación y Setup

### 🐳 Setup con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/fixcity.git
cd fixcity

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Iniciar todos los servicios
npm run docker:dev

# 4. Acceder a los servicios
# Admin Panel: http://localhost:3000
# API Backend: http://localhost:3001
# MongoDB: mongodb://localhost:27017
```

### 💻 Setup Manual (Desarrollo Local)

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/tu-usuario/fixcity.git
cd fixcity
npm install

# 2. Configurar cada módulo
cd backend && npm install && cd ..
cd admin-panel && npm install && cd ..
cd mobile-app && npm install && cd ..

# 3. Configurar variables de entorno
cp .env.example .env
# Configurar MongoDB, Redis, Firebase, etc.

# 4. Iniciar MongoDB y Redis localmente
mongod --dbpath /path/to/your/db
redis-server

# 5. Iniciar servicios en desarrollo
npm run dev
```

## 💻 Desarrollo

### 🔧 Configuración del Entorno de Desarrollo

```bash
# Instalar dependencias globales necesarias
npm install -g @react-native-community/cli
npm install -g expo-cli

# Para desarrollo móvil (iOS)
cd ios && pod install && cd ..

# Iniciar Metro bundler para React Native
npx react-native start

# Ejecutar en simulador
npx react-native run-ios     # iOS
npx react-native run-android # Android
```

### 🌿 Variables de Entorno

Crea tu archivo `.env` basado en `.env.example`:

```env
# Base de Datos
MONGODB_URI=mongodb://localhost:27017/fixcity_dev
REDIS_URL=redis://localhost:6379

# Autenticación
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-email

# API Configuration
API_PORT=3001
API_BASE_URL=http://localhost:3001

# Admin Panel
REACT_APP_API_URL=http://localhost:3001
REACT_APP_FIREBASE_CONFIG={"apiKey":"your-key"}

# Mobile App
REACT_NATIVE_API_URL=http://localhost:3001
```

## 📁 Estructura del Proyecto

```
fixcity/
├── 📱 mobile-app/              # Aplicación móvil React Native
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── screens/           # Pantallas de la aplicación
│   │   ├── navigation/        # Configuración de navegación
│   │   ├── services/          # Servicios API y utilidades
│   │   ├── contexts/          # Contextos de React
│   │   └── assets/            # Imágenes, iconos, fuentes
│   ├── android/               # Configuración Android
│   ├── ios/                   # Configuración iOS
│   └── __tests__/             # Tests unitarios
│
├── 💻 admin-panel/             # Panel de administración React
│   ├── public/                # Archivos estáticos
│   ├── src/
│   │   ├── components/        # Componentes UI
│   │   ├── pages/             # Páginas principales
│   │   ├── services/          # Llamadas API
│   │   ├── contexts/          # Estados globales
│   │   ├── utils/             # Utilidades y helpers
│   │   └── assets/            # Recursos estáticos
│   └── build/                 # Build de producción
│
├── 🔧 backend/                 # API Backend Express.js
│   ├── src/
│   │   ├── controllers/       # Controladores de rutas
│   │   ├── models/            # Modelos de MongoDB
│   │   ├── routes/            # Definición de rutas
│   │   ├── middleware/        # Middleware personalizado
│   │   ├── services/          # Lógica de negocio
│   │   ├── config/            # Configuraciones
│   │   └── utils/             # Utilidades
│   ├── uploads/               # Archivos temporales
│   └── tests/                 # Tests de API
│
├── 🐳 docker/                  # Configuraciones Docker
│   ├── nginx/                 # Configuración Nginx
│   └── mongodb/               # Scripts de inicialización DB
│
├── 📚 docs/                    # Documentación del proyecto
│   ├── api/                   # Documentación API
│   ├── deployment/            # Guías de despliegue
│   └── user-guides/           # Manuales de usuario
│
├── 🔨 scripts/                 # Scripts de utilidad
│   ├── setup.sh               # Script de configuración inicial
│   ├── deploy.sh              # Script de despliegue
│   └── backup.sh              # Script de respaldo
│
├── 📝 .github/                 # Configuración GitHub
│   ├── workflows/             # GitHub Actions CI/CD
│   └── ISSUE_TEMPLATE/        # Templates para issues
│
├── 🐳 docker-compose.yml       # Orquestación Docker
├── 📋 package.json             # Dependencias y scripts globales
├── 🔒 .env.example             # Ejemplo de variables de entorno
└── 📖 README.md               # Este archivo
```

## 📡 API Documentation

La documentación completa de la API está disponible en:

- **Desarrollo**: http://localhost:3001/api/docs
- **Swagger UI**: Interfaz interactiva para probar endpoints
- **Postman Collection**: [Descargar colección](./docs/api/FixCity.postman_collection.json)

### 🔗 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Autenticación de usuarios |
| `POST` | `/api/auth/register` | Registro de nuevos usuarios |
| `GET` | `/api/reports` | Listar reportes con filtros |
| `POST` | `/api/reports` | Crear nuevo reporte |
| `PUT` | `/api/reports/:id` | Actualizar reporte |
| `GET` | `/api/analytics/dashboard` | Métricas del dashboard |

## 🤝 Reglas de Contribución

### 📋 Antes de Contribuir

1. **Fork** el repositorio y crea una rama desde `develop`
3. **Ejecuta** tests y linters antes de enviar PR
4. **Documenta** nuevas funcionalidades
5. **Sigue** las convenciones de commits

### ✅ Checklist para Pull Requests

- [ ] Los tests pasan (`npm test`)
- [ ] El código sigue las guías de estilo (`npm run lint`)
- [ ] Se agregó documentación para nuevas funcionalidades
- [ ] Se actualizaron los tests relevantes
- [ ] El PR tiene una descripción clara del cambio
- [ ] Se referencian los issues relacionados

### 🏷️ Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(alcance): descripción

[cuerpo opcional]

[footer opcional]
```

**Tipos válidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan funcionalidad)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**
```bash
feat(mobile): agregar pantalla de reportes
fix(api): corregir validación de geolocalización
docs(readme): actualizar instrucciones de instalación
```

## 🌿 Flujo de Git

Utilizamos **Git Flow** con las siguientes ramas:

### 📊 Estructura de Ramas

```
main/master     ← Producción (solo releases)
    ↑
release/v1.0.0  ← Preparación de release
    ↑
develop         ← Desarrollo principal
    ↑
feature/        ← Nuevas funcionalidades
hotfix/         ← Correcciones críticas
```

### 🔄 Workflow de Desarrollo

1. **Crear Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre-funcionalidad
   ```

2. **Desarrollo y Commits**
   ```bash
   git add .
   git commit -m "feat(scope): descripción del cambio"
   git push origin feature/nombre-funcionalidad
   ```

3. **Pull Request**
   - Crear PR desde `feature/nombre-funcionalidad` hacia `develop`
   - Solicitar revisión de al menos 1 desarrollador
   - Asegurar que pasen todos los checks de CI

4. **Release Process**
   ```bash
   git checkout develop
   git checkout -b release/v1.0.0
   # Actualizar versiones, changelog, etc.
   git checkout main
   git merge release/v1.0.0
   git tag v1.0.0
   ```

### 🚨 Hotfix Process

Para correcciones críticas en producción:

```bash
git checkout main
git checkout -b hotfix/descripcion-corta
# Hacer la corrección
git checkout main
git merge hotfix/descripcion-corta
git checkout develop
git merge hotfix/descripcion-corta
git tag v1.0.1
```

### 🔒 Reglas de Protección de Ramas

- **main/master**: Requiere PR, revisión y tests pasando
- **develop**: Requiere PR y tests pasando
- **feature/**: Sin restricciones, pero se recomienda testing
- **release/**: Requiere revisión antes de merge a main

## 🛠️ Scripts Disponibles

### Scripts Globales (Raíz del proyecto)

```bash
# Desarrollo
npm run dev              # Inicia todos los servicios en desarrollo
npm run dev:backend      # Solo backend API
npm run dev:admin        # Solo panel de administración
npm run dev:mobile       # Solo app móvil

# Docker
npm run docker:dev       # Inicia stack completo con Docker
npm run docker:prod      # Deploy de producción con Docker
npm run docker:clean     # Limpia containers e imágenes

# Testing
npm test                 # Ejecuta tests en todos los módulos
npm run test:backend     # Tests solo del backend
npm run test:admin       # Tests solo del panel admin
npm run test:mobile      # Tests solo de la app móvil

# Linting y Formateo
npm run lint             # Lint en todos los módulos
npm run lint:fix         # Auto-fix de problemas de lint
npm run format           # Formateo de código con Prettier

# Build y Deploy
npm run build            # Build de producción
npm run build:admin      # Build solo del panel admin
npm run deploy:staging   # Deploy a staging
npm run deploy:prod      # Deploy a producción

# Utilidades
npm run setup            # Configuración inicial del proyecto
npm run clean            # Limpia node_modules y builds
npm run backup:db        # Respaldo de base de datos
npm run seed:db          # Poblar base de datos con datos de prueba
```

### Scripts por Módulo

**Backend:**
```bash
cd backend
npm run dev         # Desarrollo con nodemon
npm run start       # Producción
npm run test        # Jest tests
npm run test:watch  # Tests en modo watch
npm run seed        # Poblar base de datos
```

**Admin Panel:**
```bash
cd admin-panel
npm start           # Desarrollo
npm run build       # Build de producción
npm test            # Jest tests
npm run analyze     # Análisis del bundle
```

**Mobile App:**
```bash
cd mobile-app
npm start           # Metro bundler
npm run ios         # Ejecutar en iOS
npm run android     # Ejecutar en Android
npm test            # Jest tests
npm run build:ios   # Build para iOS
npm run build:android # Build para Android
```

## 🚀 Deploy y Producción

### 🐳 Deploy con Docker (Recomendado)

```bash
# 1. Configurar variables de entorno de producción
cp .env.example .env.prod
# Editar .env.prod con configuraciones de producción

# 2. Deploy completo
npm run deploy:prod

# 3. Verificar servicios
docker-compose ps
```

### ☁️ Deploy en Cloud Providers

#### AWS (EC2 + RDS + S3)
```bash
# 1. Configurar AWS CLI
aws configure

# 2. Crear infraestructura con Terraform
cd infrastructure/aws
terraform init
terraform plan
terraform apply

# 3. Deploy con GitHub Actions
# (Se ejecuta automáticamente en push a main)
```

#### Google Cloud Platform
```bash
# 1. Configurar gcloud CLI
gcloud auth login
gcloud config set project fixcity-prod

# 2. Deploy a Cloud Run
gcloud run deploy fixcity-backend --source ./backend
gcloud run deploy fixcity-admin --source ./admin-panel
```

#### DigitalOcean
```bash
# 1. Configurar doctl
doctl auth init

# 2. Deploy con Docker
docker-compose -f docker-compose.prod.yml up -d
```

### 🔒 Configuraciones de Seguridad

- **HTTPS**: Certificados SSL automáticos con Let's Encrypt
- **Firewall**: Solo puertos 80, 443 y SSH abiertos
- **Database**: MongoDB con autenticación y SSL
- **API**: Rate limiting y CORS configurado
- **Secrets**: Variables sensibles en Azure Key Vault / AWS Secrets Manager

## 🧪 Testing

### 🔬 Estrategia de Testing

- **Unit Tests**: Componentes y funciones individuales
- **Integration Tests**: APIs y flujos completos
- **E2E Tests**: Flujos de usuario completos
- **Performance Tests**: Carga y estrés de API

### 📊 Coverage Goals

| Módulo | Coverage Objetivo | Actual |
|--------|------------------|--------|
| Backend API | ≥ 80% | ![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen) |
| Admin Panel | ≥ 70% | ![Coverage](https://img.shields.io/badge/coverage-72%25-green) |
| Mobile App | ≥ 70% | ![Coverage](https://img.shields.io/badge/coverage-68%25-yellow) |

### 🏃 Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Tests E2E
npm run test:e2e

# Tests de performance
npm run test:perf
```

### 🤖 Continuous Integration

GitHub Actions ejecuta automáticamente:

- **Pull Request**: Lint, tests, build
- **Push to develop**: Tests completos, deploy a staging
- **Push to main**: Tests, build, deploy a producción

## 🆘 Troubleshooting

### Problemas Comunes

#### 🐳 Docker Issues

**Error: "Cannot connect to MongoDB"**
```bash
# Verificar que MongoDB está corriendo
docker-compose ps

# Reiniciar servicios
docker-compose restart mongodb backend
```

**Error: "Port already in use"**
```bash
# Encontrar proceso usando el puerto
lsof -i :3000

# Detener todos los containers
docker-compose down
```

#### 📱 React Native Issues

**Error: "Unable to resolve module"**
```bash
# Limpiar cache
npx react-native start --reset-cache

# Reinstalar dependencias
cd mobile-app
rm -rf node_modules
npm install
```

**Error: "Build failed" (iOS)**
```bash
# Limpiar build de Xcode
cd ios
xcodebuild clean

# Reinstalar pods
rm -rf Pods
pod install
```

#### 🔧 API Issues

**Error: "JWT token invalid"**
- Verificar que JWT_SECRET esté configurado
- Verificar que el token no haya expirado

**Error: "Firebase connection failed"**
- Verificar credenciales de Firebase
- Verificar que el proyecto de Firebase esté activo

### 🔍 Logs y Debugging

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f mongodb

# Acceder a container para debugging
docker-compose exec backend sh
```

### 📞 Soporte

Si encuentras un problema que no está documentado:

1. **Revisar** [Issues existentes](https://github.com/tu-usuario/fixcity/issues)
2. **Crear** un nuevo issue con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Logs relevantes
   - Información del entorno

## 👥 Contribuidores

### 🏆 Core Team

- **[Tu Nombre]** - *Project Lead & Backend Developer* - [@tu-usuario](https://github.com/tu-usuario)
- **[Nombre]** - *Frontend Developer* - [@usuario](https://github.com/usuario)
- **[Nombre]** - *Mobile Developer* - [@usuario](https://github.com/usuario)
- **[Nombre]** - *DevOps Engineer* - [@usuario](https://github.com/usuario)

### 🤝 Contributors

Ver la lista completa de [contribuidores](https://github.com/tu-usuario/fixcity/contributors) que han participado en este proyecto.

### 🙏 Agradecimientos

- **Comunidad Open Source** por las herramientas y librerías utilizadas
- **Beta Testers** que ayudaron a mejorar la plataforma
- **Municipios** que proporcionaron retroalimentación valiosa

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <p><strong>Hecho con ❤️ para mejorar nuestras ciudades</strong></p>

  [![GitHub stars](https://img.shields.io/github/stars/abrahamcruzc/fixcity?style=social)](https://github.com/abrahamcruzc/fixcity/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/tu-usuario/fixcity?style=social)](https://github.com/abrahamcruzc/fixcity/network)
  [![GitHub watchers](https://img.shields.io/github/watchers/tu-usuario/fixcity?style=social)](https://github.com/abrahamcruzc/fixcity/watchers)

  **[Sitio Web](https://fixcity.com) • [Documentación](https://docs.fixcity.com) • [Demo](https://demo.fixcity.com)**
</div>
