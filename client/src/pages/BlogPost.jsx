import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SEO } from './SEO';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/Core';

export const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Mock content for demonstration
  const content = {
    title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: 'Learn how to master coding for free using interactive lessons and modern platforms.',
    body: `
      <h2>Why Learn to Code for Free?</h2>
      <p>In 2026, you don't need to spend thousands on bootcamps to become a software engineer. Free coding websites for beginners offer interactive lessons that get you building real projects immediately.</p>
      
      <h3>The Power of Interactive Lessons</h3>
      <p>Watching videos is passive. Interactive coding lessons force you to solve problems, which builds muscle memory and critical thinking. Platforms like CodLift provide an instant feedback loop.</p>
      
      <h2>Getting Started Today</h2>
      <p>Start with HTML and CSS. They are the building blocks of the web. Once you understand the DOM and styling, move on to JavaScript to add interactivity.</p>
    `,
    date: 'May 5, 2026',
    author: 'CodLift Team'
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": content.title,
    "description": content.description,
    "author": {
      "@type": "Organization",
      "name": content.author
    },
    "datePublished": "2026-05-05",
    "publisher": {
      "@type": "Organization",
      "name": "CodLift",
      "logo": {
        "@type": "ImageObject",
        "url": "https://codlift.site/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <SEO 
        title={`${content.title} | CodLift Blog`}
        description={content.description}
        url={`/blog/${slug}`}
        schema={articleSchema}
      />
      
      <div className="container mx-auto px-6 py-24 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/blog')} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Button>
        
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-syne font-extrabold mb-4 leading-tight">{content.title}</h1>
          <div className="flex items-center gap-4 text-gray-400 font-mono text-sm">
            <span>{content.date}</span>
            <span>•</span>
            <span>{content.author}</span>
          </div>
        </header>

        <article 
          className="prose prose-invert prose-lg max-w-none prose-h2:font-syne prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h3:font-syne prose-h3:text-xl prose-p:text-gray-300 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content.body }}
        />
      </div>
    </div>
  );
};
