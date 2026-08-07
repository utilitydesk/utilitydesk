const fs = require("fs");
const path = require("path");

const DOMAIN = "https://utilitydesk.in";

const EXCLUDE = [
  ".git",
  ".github",
  "node_modules",
  "assets",
  "scripts"
];

const urls = [];

function getSEO(pathname) {

  if (pathname === "") {
    return {
      priority: "1.0",
      changefreq: "daily"
    };
  }

  if (pathname.startsWith("/calculators")) {
    return {
      priority: "0.9",
      changefreq: "weekly"
    };
  }

  if (pathname.startsWith("/pdf-tools")) {
    return {
      priority: "0.9",
      changefreq: "weekly"
    };
  }

  if (pathname.startsWith("/document-generators")) {
    return {
      priority: "0.9",
      changefreq: "weekly"
    };
  }

  if (pathname.startsWith("/hr")) {
    return {
      priority: "0.9",
      changefreq: "weekly"
    };
  }

  if (pathname.startsWith("/templates")) {
    return {
      priority: "0.8",
      changefreq: "monthly"
    };
  }

  if (pathname.startsWith("/blog")) {
    return {
      priority: "0.8",
      changefreq: "monthly"
    };
  }

  return {
    priority: "0.6",
    changefreq: "yearly"
  };
}

function scan(dir) {

  for (const file of fs.readdirSync(dir)) {

    const full = path.join(dir, file);

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {

      if (EXCLUDE.includes(file)) continue;

      scan(full);

      continue;
    }

    if (file !== "index.html") continue;

    let url = full
      .replace(process.cwd(), "")
      .replace(/\\/g, "/")
      .replace("/index.html", "");

    const seo = getSEO(url);

    urls.push({
      loc: DOMAIN + (url || ""),
      lastmod: stat.mtime.toISOString().split("T")[0],
      priority: seo.priority,
      changefreq: seo.changefreq
    });

  }

}

scan(process.cwd());

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const page of urls) {

  xml += `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;

}

xml += `
</urlset>`;

fs.writeFileSync("sitemap.xml", xml);

console.log(`Generated ${urls.length} URLs`);