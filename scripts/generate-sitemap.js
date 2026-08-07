const fs = require("fs");
const path = require("path");

const DOMAIN = "https://utilitydesk.in";

const EXCLUDE = [
  "node_modules",
  ".git",
  ".github",
  "assets"
];

const urls = [];

function scan(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {

    const full = path.join(dir, file);

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {

      if (EXCLUDE.includes(file)) return;

      scan(full);

      return;
    }

    if (file !== "index.html") return;

    let url = full
      .replace(process.cwd(), "")
      .replace(/\\/g, "/")
      .replace("/index.html", "/");

    if (url === "/") {
      url = "";
    }

    urls.push({
      loc: DOMAIN + url,
      lastmod: new Date(stat.mtime).toISOString().split("T")[0]
    });

  });
}

scan(process.cwd());

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

urls.forEach(u => {

  xml += `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

});

xml += `
</urlset>`;

fs.writeFileSync("sitemap.xml", xml);

console.log(`Generated sitemap with ${urls.length} URLs`);