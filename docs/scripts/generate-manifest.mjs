import { join } from "path"
import { readdir, readFile, writeFile } from "fs/promises"

const providers = {}
const providersPath = join(process.cwd(), "../packages/core/src/providers")
const providerFiles = await readdir(providersPath, "utf8")

for (const file of providerFiles) {
  if (["index.ts", "oauth-types.ts", "oauth.ts"].includes(file)) continue
  const provider = await readFile(join(providersPath, file), "utf8")
  const { id } = provider.match(/id: "(?<id>.+)",/).groups
  const { title } = provider.match(/name: "(?<title>.+)",/).groups
  providers[id] = title
}

const content = JSON.stringify(
  {
    // TODO: Autogenerate from packages + package.json#exports
    frameworks: [
      {
        packageDir: "core",
        packageName: "@auth/core",
        id: "core",
        entrypoints: [
          "index.ts",
          "adapters.ts",
          "errors.ts",
          "jwt.ts",
          "types.ts",
          "providers/index.ts",
          ...Object.keys(providers).map((id) => `providers/${id}.ts`),
        ],
      },
      {
        id: "nextjs",
        packageName: "next-auth",
        packageDir: "next-auth",
        name: "NextAuth.js",
        url: "next-auth-example",
        entrypoints: [
          "index.tsx",
          "react.tsx",
          "jwt.ts",
          "next.ts",
          "types.ts",
          "middleware.ts",
        ],
      },
      {
        id: "sveltekit",
        packageName: "@auth/sveltekit",
        packageDir: "frameworks-sveltekit",
        name: "SvelteKit Auth",
        url: "sveltekit-auth-example",
        entrypoints: ["lib/index.ts", "lib/client.ts"],
      },
      {
        id: "solidstart",
        packageName: "@auth/solid-start",
        packageDir: "frameworks-solid-start",
        name: "SolidStart Auth",
        url: "auth-solid",
        entrypoints: ["index.ts", "client.ts"],
      },
    ],
    // TODO: Autogenerate
    adapters: [
      { id: "azure-tables", name: "Azure Tables Storage" },
      { id: "d1", name: "D1" },
      { id: "dgraph", name: "Dgraph", img: "dgraph.png" },
      { id: "drizzle", name: "DrizzleORM", img: "drizzle-orm.png" },
      { id: "dynamodb", name: "DynamoDB", img: "dynamodb.png" },
      { id: "edgedb", name: "EdgeDB" },
      { id: "fauna", name: "Fauna", img: "fauna.png" },
      { id: "firebase", name: "Firebase" },
      { id: "hasura", name: "Hasura" },
      { id: "kysely", name: "Kysely" },
      { id: "mikro-orm", name: "Mikro ORM", img: "mikro-orm.png" },
      { id: "mongodb", name: "MongoDB" },
      { id: "neo4j", name: "Neo4j" },
      { id: "pg", name: "pg", img: "pg.png" },
      { id: "pouchdb", name: "PouchDB" },
      { id: "prisma", name: "Prisma" },
      { id: "sequelize", name: "Sequelize" },
      { id: "supabase", name: "Supabase" },
      { id: "surrealdb", name: "SurrealDB", img: "surreal.png" },
      { id: "typeorm", name: "TypeORM", img: "typeorm.png" },
      { id: "upstash-redis", name: "Upstash Redis" },
      { id: "xata", name: "Xata" },
    ],
    providers,
  },
  null,
  2
)
await writeFile(
  join(process.cwd(), "manifest.mjs"),
  `
// This file is autogenerated by scripts/generate-manifest.mjs
export default ${content}`
)
