const fs = require("fs");
const path = require("path");
const DOMAIN = "https://utilitydesk.in";
const EXCLUDE = [".git", ".github", "node_modules", "assets", "scripts"];
const urls = [];
function getSEO(pathname) {
  if (pathname === "") return { priority: "1.0", changefreq: "daily" };
  if (pathname.startsWith("/calculators")) return { priority: "0.9", changefreq: "weekly" };
  if (pathname.startsWith("/pdf-tools")) return { priority: "0.9", changefreq: "weekly" };
  if (pathname.startsWith("/document-generators")) return { priority: "0.9", changefreq: "weekly" };
  if (pathname.startsWith("/hr")) return { priority: "0.9", changefreq: "weekly" };
  if (pathname.startsWith("/templates")) return { priority: "0.8", changefreq: "monthly" };
  if (pathname.startsWith("/blog")) return { priority: "0.8", changefreq: "monthly" };
  return { priority: "0.6", changefreq: "yearly" };
}
function scan(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file); const stat = fs.statSync(full);
    if (stat.isDirectory()) { if (!EXCLUDE.includes(file)) scan(full); continue; }
    if (file !== "index.html") continue;
    const html = fs.readFileSync(full, "utf8");
    const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
    if (robots && /noindex/i.test(robots[1])) continue;
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    if (!canonical) continue;
    const url = canonical[1].replace(/^https:\/\/www\.utilitydesk\.in/, DOMAIN).replace(/\/$/, "") + "/";
    const pathname = new URL(url).pathname.replace(/\/$/, "");
    const expectedPath = full.replace(process.cwd(), "").replace(/\\/g, "/").replace(/\/index\.html$/, "");
    if (pathname !== (expectedPath || "/")) continue;
    const seo = getSEO(pathname); urls.push({loc:url,lastmod:stat.mtime.toISOString().split("T")[0],priority:seo.priority,changefreq:seo.changefreq});
  }
}
scan(process.cwd()); urls.sort((a,b)=>a.loc.localeCompare(b.loc));
let xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (const p of urls) xml += `\n  <url>\n    <loc>${p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`;
xml += '\n</urlset>\n'; fs.writeFileSync("sitemap.xml",xml); console.log(`Generated ${urls.length} canonical indexable URLs`);
