import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, isFolderPath } from "../util/path"
// @ts-ignore
import script from "./scripts/randompost.inline"

interface RandomPostOptions {
  /**
   * Text to display on the button
   */
  buttonText: string
  /**
   * Folders to exclude from random selection
   */
  excludeFolders?: string[]
}

const defaultOptions: RandomPostOptions = {
  buttonText: "🎲 Surprise Me!",
  excludeFolders: ["static"],
}

export default ((opts?: Partial<RandomPostOptions>) => {
  const options: RandomPostOptions = { ...defaultOptions, ...opts }

  const RandomPost: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    // Filter posts similar to AllPostsContent
    const eligiblePosts = allFiles.filter((file) => {
      // Skip folders
      if (isFolderPath(file.slug!)) return false
      
      // Skip index pages
      if (file.slug!.endsWith("/index") || file.slug === "index") return false
      
      // Skip files in excluded folders
      if (options.excludeFolders?.some(excludedFolder => 
        file.slug!.startsWith(excludedFolder + "/")
      )) return false
      
      // Skip special pages
      if (file.slug === "all-posts" || file.slug === "about") return false
      
      return true
    })

    // Store eligible posts data for client-side access
    const postsData = eligiblePosts.map(post => ({
      slug: post.slug!,
      title: post.frontmatter?.title || post.slug!
    }))

    return (
      <button 
        class="random-post-btn"
        id="random-post-btn"
        data-posts={JSON.stringify(postsData)}
        data-current-slug={fileData.slug}
        title="Go to a random post"
      >
        {options.buttonText}
      </button>
    )
  }

  RandomPost.css = `
  .random-post-btn {
    background: var(--secondary);
    color: var(--light);
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    transition: all 0.2s ease;
    white-space: nowrap;
    width: 100%;
    margin-top: 1rem;
    text-align: center;
    display: block;
  }

  .random-post-btn:hover {
    background: var(--secondary);
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .random-post-btn:active {
    transform: translateY(0px);
  }

  @media (max-width: 768px) {
    .random-post-btn {
      margin-top: 0.5rem;
      padding: 0.6rem 0.8rem;
      font-size: 0.8rem;
    }
  }
  `

  RandomPost.afterDOMLoaded = script

  return RandomPost
}) satisfies QuartzComponentConstructor