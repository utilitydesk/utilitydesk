import SEO from "./seo-config.js";

export function generateSEO(data){

return `

<title>${data.title || SEO.defaultTitle}</title>

<meta name="description"
content="${data.description || SEO.defaultDescription}">

<link rel="canonical"
href="${SEO.siteUrl}${data.path}">

<meta property="og:title"
content="${data.title}">

<meta property="og:description"
content="${data.description}">

<meta property="og:image"
content="${SEO.defaultImage}">

<meta property="og:url"
content="${SEO.siteUrl}${data.path}">

<meta property="og:type"
content="website">

<meta name="twitter:card"
content="summary_large_image">

<meta name="twitter:title"
content="${data.title}">

<meta name="twitter:description"
content="${data.description}">

<meta name="twitter:image"
content="${SEO.defaultImage}">
`;
}