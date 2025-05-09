# 🗳️ Sistema de Gestión de Asistencia a Elecciones - SUTEPA

Este sistema fue desarrollado para modernizar el control de asistencia y votación durante las elecciones del **Sindicato Unido de Trabajadores y Empleados del PAMI (SUTEPA)**.  
Permite validar la asistencia de afiliados mediante códigos QR, registrar ingresos y egresos, gestionar votaciones en tiempo real y supervisar todo el proceso desde un panel administrativo distribuido por roles específicos.

---

## 🚀 Funcionalidades principales

- ✅ Panel de control con métricas en tiempo real
- ✅ Gestión de afiliados
- ✅ Validación de asistencia por QR dinámico
- ✅ Registro de ingresos y egresos
- ✅ Votaciones en tiempo real con conteo automático
- ✅ Visualización de abstenciones y no participantes
- ✅ Exportación de resultados a Excel

---

## 🧠 Tecnologías utilizadas

| Capa          | Tecnología             |
| ------------- | ---------------------- |
| Frontend      | React + Vite + TailwindCSS |
| Backend       | Laravel + MySQL        |
| Autenticación | Sistema propio (Laravel Sanctum / JWT) |
| Comunicación  | WebSockets (Laravel Echo + Pusher u otro driver) |
| Estado global | TanStack Query v5      |
| Exportación   | Laravel Excel (`maatwebsite/excel`) |

---

## 👥 Roles del sistema

| Rol         | Descripción                                                                 |
|-------------|------------------------------------------------------------------------------|
| 🛡️ Administrador | Visualiza estadísticas, administra usuarios y gestiona todos los módulos         |
| ✍️ Secretario   | Crea y emite preguntas de votación en tiempo real                          |
| 🟢 Ingreso      | Registra el ingreso de los afiliados mediante QR                            |
| 🔴 Egreso       | Registra el egreso cuando los afiliados abandonan el recinto               |
| 🙋 Afiliado     | Escanea su QR para ingresar y responde las votaciones desde su dispositivo |

---

## ⚙️ Instalación y configuración

### 🔁 Paso a paso para levantar todo el sistema

---

### 📂 1. Clonar el repositorio

```bash
git clone https://github.com/Nahuewe/Sutepa-asistencia-front.git
cd Sutepa-asistencia-front
```

### 💼 2. Instalar todas las dependencias y correr el proyecto

```bash
npm install
npm run dev
```