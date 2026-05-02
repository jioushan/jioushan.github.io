import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  //base: '/peer/',
  lang: 'en-US',
  title: "JSMSR Network | Peer",
  description: "JSMSR Network Server",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.svg',

    nav: [
      { text: 'Index', link: 'index.md' },
      { text: 'About', link: '/about' }
    ],

    sidebar: [
      {
        text: 'Peer',
        items: [
          { text: 'Communities', link: '/Communities' },
          { text: 'Contact', link: '/contact' },
          { text: 'More', link: '/more' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jioushan/jioushan.github.io' }
    ],
    footer: {
      copyright: 'Copyright © 2019-<span id="year"></span> JSMSR Network <span id="build-ver"></span>'
    },
    search: {
      provider: 'local'
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['script', {}, `
      document.addEventListener('DOMContentLoaded', function() {
        var y = document.getElementById('year');
        if (y) y.textContent = new Date().getFullYear();
        fetch('/version.json').then(function(r){return r.json()}).then(function(d){
          var v = document.getElementById('build-ver');
          if (v) v.textContent = ' | ' + d.commit;
        }).catch(function(){});
      });
    `]
  ]
})
