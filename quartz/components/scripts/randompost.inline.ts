document.addEventListener("nav", () => {
  const randomBtn = document.getElementById("random-post-btn") as HTMLButtonElement
  if (!randomBtn) return

  const handleRandomPost = () => {
    try {
      const postsData = JSON.parse(randomBtn.dataset.posts || "[]")
      const currentSlug = randomBtn.dataset.currentSlug || ""
      
      if (postsData.length === 0) {
        console.warn("No posts available for random selection")
        return
      }

      // Get a random post
      const randomIndex = Math.floor(Math.random() * postsData.length)
      const randomPost = postsData[randomIndex]
      
      // Simple relative path resolution
      const randomSlug = randomPost.slug
      const targetUrl = randomSlug.startsWith("/") ? randomSlug : `/${randomSlug}`
      
      // Navigate to the random post
      window.location.href = targetUrl
      
    } catch (error) {
      console.error("Error selecting random post:", error)
    }
  }

  randomBtn.removeEventListener("click", handleRandomPost)
  randomBtn.addEventListener("click", handleRandomPost)
})