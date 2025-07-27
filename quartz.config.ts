import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { customOgImage } from "./quartz/util/customOgImage"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "A Little Less Dumb",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "localhost", // placeholder until deployed
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#FFFFFF",
          lightgray: "#f0f4ff",
          gray: "#b8bfd1",
          darkgray: "#56657a",
          dark: "#222222",
          secondary: "#FF7A00",
          tertiary: "#FFE8CC",
          highlight: "rgba(255, 122, 0, 0.1)",
          textHighlight: "#fff23688",
          
        },
        darkMode: {
          light: "#121212",
          lightgray: "#2a2a2a",
          gray: "#555555",
          darkgray: "#aaaaaa",
          dark: "#ffffff",
          secondary: "#FF9E42",
          tertiary: "#3B3B3B",
          highlight: "rgba(255, 122, 0, 0.15)",
          textHighlight: "#ffb34788",
          
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
        rssFullHtml: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Custom OG images with site personality (temporarily disabled for testing)
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
