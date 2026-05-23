import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const [outputDir = "../../apps/registry/public/r"] = process.argv.slice(2)
const config = JSON.parse(readFileSync("components.json", "utf8"))

const aliasRewrites = [
  [config.aliases.utils, "@/lib/utils"],
  [config.aliases.components, "@/components"],
  [config.aliases.ui, "@/components"],
  [config.aliases.lib, "@/lib"],
  [config.aliases.hooks, "@/hooks"],
]
  .filter(([from]) => Boolean(from))
  .sort(([a], [b]) => b.length - a.length)

function rewriteContent(content) {
  return aliasRewrites.reduce(
    (nextContent, [from, to]) => nextContent.replaceAll(from, to),
    content
  )
}

const jsonFiles = readdirSync(outputDir).filter((file) =>
  file.endsWith(".json")
)
let foundPackageAlias = false

for (const file of jsonFiles) {
  const filePath = join(outputDir, file)
  const content = readFileSync(filePath, "utf8")
  const rewritten = rewriteContent(content)

  if (rewritten.includes("@nswds/ui/")) {
    foundPackageAlias = true
  }

  if (rewritten !== content) {
    writeFileSync(filePath, rewritten)
  }
}

if (foundPackageAlias) {
  throw new Error(
    `Registry output still contains @nswds/ui imports in ${outputDir}`
  )
}
