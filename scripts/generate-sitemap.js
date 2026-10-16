const fs = require("fs");
const path = require("path");

const DOMAIN = "https://utilitydesk.in";

const EXCLUDE = new Set([
  ".git",
  ".github",
  "node_modules",
  "assets",
  "scripts"
]);

const urls = [];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getSEO(pathname) {
  if (pathname === "") {
    return { priority: "1.0", changefreq: "daily" };
  }

  if (pathname.startsWith("/calculators")) {
    return { priority: "0.9", changefreq: "weekly" };
  }

  if (pathname.startsWith("/pdf-tools")) {
    return { priority: "0.9", changefreq: "weekly" };
  }

  if (pathname.startsWith("/document-generators")) {
    return { priority: "0.9", changefreq: "weekly" };
  }

  if (pathname.startsWith("/hr")) {
    return { priority: "0.9", changefreq: "weekly" };
  }

  if (pathname.startsWith("/templates")) {
    return { priority: "0.8", changefreq: "monthly" };
  }

  if (pathname.startsWith("/blog")) {
    return { priority: "0.8", changefreq: "monthly" };
  }

  return { priority: "0.6", changefreq: "yearly" };
}

function scan(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      if (!EXCLUDE.has(file)) scan(full);
      continue;
    }

    if (file !== "index.html") continue;

    const relative = path.relative(process.cwd(), full).replace(/\\/g, "/");
    const url = relative === "index.html"
      ? ""
      : "/" + relative.slice(0, -"index.html".length);
    const seo = getSEO(url);

    urls.push({
      loc: DOMAIN + url,
      lastmod: stat.mtime.toISOString().split("T")[0],
      priority: seo.priority,
      changefreq: seo.changefreq
    });
  }
}

scan(process.cwd());

const uniqueUrls = Array.from(
  new Map(urls.map(page => [page.loc, page])).values()
).sort((a, b) => a.loc.localeCompare(b.loc));

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const page of uniqueUrls) {
  xml += `
  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <lastmod>${escapeXml(page.lastmod)}</lastmod>
    <changefreq>${escapeXml(page.changefreq)}</changefreq>
    <priority>${escapeXml(page.priority)}</priority>
  </url>`;
}

xml += `
</urlset>\n`;

fs.writeFileSync("sitemap.xml", xml, "utf8");

console.log(`Generated ${uniqueUrls.length} URLs`);
