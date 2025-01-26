import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/peer/',
  lang: 'en-US',
  title: "JSMSR Network | Peer",
  description: "JSMSR Network Server",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'favicon.svg',
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
      message: 'The site for VitePress deployment',
      copyright: 'Copyright © 2019-2025 JSMSR Network'
    },
    search: {
      provider: 'local'  // 内置本地搜索功能
    },
  },
  head: [['link', { rel: 'icon', href: '/favicon.png' }]]
})
