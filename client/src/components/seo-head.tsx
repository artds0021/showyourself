import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  schema?: any;
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage,
  schema
}: SEOHeadProps) {
  useEffect(() => {
    // Set title
    document.title = title;
    
    // Set meta description
    updateMeta("description", description);
    
    // Set keywords if provided
    if (keywords) {
      updateMeta("keywords", keywords);
    }
    
    // Set Open Graph tags
    updateMeta("og:title", ogTitle || title, "property");
    updateMeta("og:description", ogDescription || description, "property");
    updateMeta("og:type", "website", "property");
    
    if (ogUrl) {
      updateMeta("og:url", ogUrl, "property");
    }
    
    if (ogImage) {
      updateMeta("og:image", ogImage, "property");
    }
    
    // Set Twitter Card tags
    updateMeta("twitter:card", "summary_large_image", "name");
    updateMeta("twitter:title", ogTitle || title, "name");
    updateMeta("twitter:description", ogDescription || description, "name");
    
    if (ogImage) {
      updateMeta("twitter:image", ogImage, "name");
    }
    
    // Add structured data if provided
    if (schema) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogUrl, ogImage, schema]);
  
  return null;
}

function updateMeta(name: string, content: string, attribute: string = "name") {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}
