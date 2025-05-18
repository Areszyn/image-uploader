import '../styles/globals.css'

export const metadata = {
  title: 'Image Uploader',
  description: 'Upload images and get direct URLs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
