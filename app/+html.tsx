import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* SEO Meta Tags */}
        <title>EsportsIndia - Level Up Your Gaming Journey | India's Premier Esports Platform</title>
        <meta name="description" content="Join India's premier esports platform. Compete in tournaments for BGMI, Free Fire, Call of Duty, Valorant. Track winners, connect with gamers, and level up your gaming journey." />
        <meta name="keywords" content="esports, gaming, tournaments, BGMI, Free Fire, Call of Duty, Valorant, India, gaming platform, esports India" />
        <meta name="author" content="EsportsIndia" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="EsportsIndia - Level Up Your Gaming Journey" />
        <meta property="og:description" content="Join India's Premier Esports Platform. Compete in tournaments, track winners, and connect with gamers." />
        <meta property="og:site_name" content="EsportsIndia" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EsportsIndia - Level Up Your Gaming Journey" />
        <meta name="twitter:description" content="Join India's Premier Esports Platform. Compete in tournaments, track winners, and connect with gamers." />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        
        {/* Performance and Security */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="theme-color" content="#141E30" />
        
        {/* Disable body scrolling for ScrollView compatibility */}
        <ScrollViewStyleReset />

        {/* Production-level styling */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #0A0E1A;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
* {
  box-sizing: border-box;
}
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
/* Web-specific hover effects */
button, a {
  transition: all 0.3s ease;
}
/* Performance optimizations */
* {
  -webkit-tap-highlight-color: transparent;
}
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
`;
