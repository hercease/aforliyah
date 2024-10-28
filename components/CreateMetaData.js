// utils/metadata.js
export function createMetadata(title, description, url) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: `${url}/og-image.jpg`,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
  };
}
