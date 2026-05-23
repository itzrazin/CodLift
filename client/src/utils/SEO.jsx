
import { Helmet } from 'react-helmet-async';

export const SEO = ({ 
  title, 
  description, 
  keywords,
  url,
  image = 'https://codlift.site/og-image.png',
  schema 
}) => {
  const siteUrl = 'https://codlift.site';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Theme Color & Robots */}
      <meta name="theme-color" content="#080b10" />
      <meta name="robots" content="index, follow" />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
