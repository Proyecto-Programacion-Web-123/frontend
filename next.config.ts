import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    // ⚠️ Solo para desarrollo - no recomiendo en producción
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚙️ Opcional: también ignorar errores TypeScript
    ignoreBuildErrors: true,
  },
}

export default nextConfig
