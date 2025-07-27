import { SocialImageOptions, ImageComponentProps } from "./og"
import { getFontSpecificationName } from "./theme"
import { formatDate, getDate } from "../components/Date"
import readingTime from "reading-time"

// Custom OG image template for "A Little Less Dumb"
export const customOgImage: SocialImageOptions["imageStructure"] = ({
  cfg,
  userOpts,
  title,
  description,
  fileData,
  iconBase64,
}) => {
  const { colorScheme } = userOpts
  const useSmallerFont = title.length > 40

  // Format date if available
  const rawDate = getDate(cfg, fileData)
  const date = rawDate ? formatDate(rawDate, cfg.locale) : null

  // Calculate reading time
  const { minutes } = readingTime(fileData.text ?? "")
  const readingTimeText = `${Math.ceil(minutes)} min read`

  // Get tags and folder info
  const tags = fileData.frontmatter?.tags ?? []
  const slug = fileData.slug || ""
  
  // Determine content type based on folder
  let contentType = "Post"
  if (slug.startsWith("brain-dumps/")) contentType = "💭 Brain Dump"
  else if (slug.startsWith("proper-posts/")) contentType = "✍️ Proper Post"
  else if (slug.startsWith("machine-taught/")) contentType = "🤖 Machine-Taught"
  else if (slug.startsWith("gaggle-of-links/")) contentType = "📎 Gaggle of Links"
  else if (slug.startsWith("stolen-wisdom/")) contentType = "📝 Stolen Wisdom"
  else if (slug.startsWith("letterbox/")) contentType = "💌 Letterbox"
  else if (slug.startsWith("free-treasures/")) contentType = "🏛️ Free Treasures"

  const bodyFont = getFontSpecificationName(cfg.theme.typography.body)
  const headerFont = getFontSpecificationName(cfg.theme.typography.header)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: colorScheme === "lightMode" ? "#FFFFFF" : "#121212",
        padding: "3rem",
        fontFamily: bodyFont,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          background: `repeating-linear-gradient(
            45deg,
            ${colorScheme === "lightMode" ? "#FF7A00" : "#FF9E42"},
            ${colorScheme === "lightMode" ? "#FF7A00" : "#FF9E42"} 2px,
            transparent 2px,
            transparent 20px
          )`,
        }}
      />

      {/* Header with site info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {iconBase64 && (
            <img
              src={iconBase64}
              width={48}
              height={48}
              style={{ borderRadius: "8px" }}
            />
          )}
          <div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: colorScheme === "lightMode" ? "#222222" : "#ffffff",
                fontFamily: headerFont,
              }}
            >
              A Little Less Dumb
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: colorScheme === "lightMode" ? "#56657a" : "#aaaaaa",
              }}
            >
              Digital brain spillage & tentative thoughts
            </div>
          </div>
        </div>
        
        {/* Content type badge */}
        <div
          style={{
            background: colorScheme === "lightMode" ? "#FFE8CC" : "#3B3B3B",
            color: "#FF7A00",
            padding: "0.5rem 1rem",
            borderRadius: "2rem",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          {contentType}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Title */}
        <h1
          style={{
            fontSize: useSmallerFont ? "2.5rem" : "3.5rem",
            fontWeight: 700,
            color: colorScheme === "lightMode" ? "#222222" : "#ffffff",
            fontFamily: headerFont,
            lineHeight: 1.1,
            margin: 0,
            maxHeight: "12rem",
            overflow: "hidden",
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: "1.25rem",
              color: colorScheme === "lightMode" ? "#56657a" : "#aaaaaa",
              lineHeight: 1.4,
              margin: 0,
              maxHeight: "6rem",
              overflow: "hidden",
            }}
          >
            {description.length > 200 ? description.slice(0, 200) + "..." : description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  background: colorScheme === "lightMode" ? "#f0f4ff" : "#2a2a2a",
                  color: colorScheme === "lightMode" ? "#56657a" : "#aaaaaa",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "1rem",
                  fontSize: "0.8rem",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer with metadata */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "1.5rem",
          borderTop: `2px solid ${colorScheme === "lightMode" ? "#f0f4ff" : "#2a2a2a"}`,
          fontSize: "0.9rem",
          color: colorScheme === "lightMode" ? "#56657a" : "#aaaaaa",
        }}
      >
        <div style={{ display: "flex", gap: "2rem" }}>
          {date && <span>📅 {date}</span>}
          <span>⏱️ {readingTimeText}</span>
        </div>
        
        <div style={{ 
          fontSize: "0.8rem",
          opacity: 0.8,
        }}>
          bhuvan.substack.com
        </div>
      </div>
    </div>
  )
}