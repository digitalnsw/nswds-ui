/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next only runs the React Compiler when this flag is set; installing
  // babel-plugin-react-compiler alone does nothing
  // (node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/reactCompiler.md).
  reactCompiler: true,
  transpilePackages: ['@nswds/ui'],
}

export default nextConfig
