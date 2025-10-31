const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');

const hostname = 'https://battorion-website.vercel.app/';

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/services', changefreq: 'weekly', priority: 0.9 },
];

const sitemapStream = new SitemapStream({ hostname });

links.forEach(link => sitemapStream.write(link));
sitemapStream.end();

streamToPromise(sitemapStream)
  .then(sm => {
    if (!fs.existsSync('./public')) {
      fs.mkdirSync('./public');
    }
    fs.writeFileSync('./public/sitemap.xml', sm);
    console.log('✅ Sitemap generated successfully!');
  })
  .catch(err => console.error('❌ Error generating sitemap:', err));
