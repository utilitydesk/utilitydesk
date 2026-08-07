const fs = require("fs");

const robots = `User-agent: *

Allow: /

Sitemap: https://utilitydesk.in/sitemap.xml

Host: utilitydesk.in
`;

fs.writeFileSync("robots.txt", robots);

console.log("robots.txt generated successfully");
