import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/listPage.scss"
import { PageList, SortFn, byDateAndAlphabetical } from "../PageList"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { QuartzPluginData } from "../../plugins/vfile"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { isFolderPath } from "../../util/path"

interface AllPostsContentOptions {
  /**
   * Whether to display count of posts
   */
  showPostCount: boolean
  sort?: SortFn
  /**
   * Folders to exclude from the all posts listing
   */
  excludeFolders?: string[]
}

const defaultOptions: AllPostsContentOptions = {
  showPostCount: true,
  sort: byDateAndAlphabetical,
  excludeFolders: ["static"],
}

export default ((opts?: Partial<AllPostsContentOptions>) => {
  const options: AllPostsContentOptions = { ...defaultOptions, ...opts }

  const AllPostsContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props

    // Filter out folders and index pages, and excluded folders
    const allPosts: QuartzPluginData[] = allFiles.filter((file) => {
      // Skip folders
      if (isFolderPath(file.slug!)) return false
      
      // Skip index pages (files that end with index or are just folder names)
      if (file.slug!.endsWith("/index") || file.slug === "index") return false
      
      // Skip files in excluded folders
      if (options.excludeFolders?.some(excludedFolder => 
        file.slug!.startsWith(excludedFolder + "/")
      )) return false
      
      // Skip the all-posts page itself
      if (file.slug === "all-posts") return false
      
      return true
    })

    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")
    const listProps = {
      ...props,
      sort: options.sort?.(cfg),
      allFiles: allPosts,
    }

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren

    return (
      <div class="popover-hint">
        <article class={classes}>{content}</article>
        <div class="page-listing">
          {options.showPostCount && (
            <p>
              Showing {allPosts.length} posts from across the garden.
            </p>
          )}
          <div>
            <PageList {...listProps} />
          </div>
        </div>
      </div>
    )
  }

  AllPostsContent.css = concatenateResources(style, PageList.css)
  return AllPostsContent
}) satisfies QuartzComponentConstructor