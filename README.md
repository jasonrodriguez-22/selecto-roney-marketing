# Selecto Roney — Diseño y Marketing

Aplicación web React + Vite para administrar trabajos, calendario, campañas y reportes del área de Diseño Gráfico y Marketing.

## Requisitos
- Node.js LTS instalado en Windows.
- Visual Studio Code (opcional, recomendado).

## Instalar y ejecutar
Abra una terminal dentro de la carpeta que contiene `package.json` y ejecute:

```powershell
npm install
npm run dev -- --host 0.0.0.0
```

Abra la dirección `Local` que muestre Vite en la computadora anfitriona. Para acceder desde otra computadora en la misma Wi-Fi, use la dirección `Network` mostrada por Vite, por ejemplo `http://192.168.1.25:5173/`. Mantenga la terminal abierta. Si Windows Firewall pregunta, permita Node.js en redes privadas.

Para generar una versión de producción:

```powershell
npm run build
```

## Acceso de demostración
- Usuario: `admin`
- Contraseña: `Selecto2026!`

La pantalla de login se implementa en el cliente y usa `sessionStorage`. **No es autenticación segura para producción**: las credenciales pueden descubrirse desde el código de la aplicación y no protege los datos del navegador. Antes de usar información real de la empresa, implemente autenticación de servidor y una base de datos con permisos.

## Datos
Los trabajos y campañas se guardan en `localStorage` del navegador de cada computadora; no se sincronizan automáticamente entre equipos.
