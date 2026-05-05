import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../utils/SEO';
import { GlassCard } from '../components/ui/Core';

export const BlogPage = () => {
  const navigate = useNavigate();
  
  const posts = [
    {
      slug: 'how-to-learn-html',
      title: 'How to Learn HTML in 30 Days for Free',
      description: 'A comprehensive guide to mastering the skeleton of the web without spending a dime. Step-by-step curriculum included.',
      date: 'May 1, 2026'
    },
    {
      slug: 'best-free-coding-platform',
      title: 'Best Free Coding Platform for Beginners 2026',
      description: 'Why interactive learning is beating traditional video courses, and how to start coding in your browser today.',
      date: 'May 3, 2026'
    },
    {
      slug: 'learn-javascript-interactively',
      title: 'Learn JavaScript Interactively — No Setup Needed',
      description: 'Stop configuring webpack and start writing logic. Discover how to learn JavaScript through fun, gamified challenges.',
      date: 'May 4, 2026'
    },
    {
      slug: 'zero-to-first-website',
      title: 'From Zero to First Website in One Week',
      description: 'The ultimate blueprint for absolute beginners to ship their first fully functional website in just 7 days.',
      date: 'May 5, 2026'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="CodLift Blog — Free Coding Tutorials & Guides"
        description="Read our latest guides on learning HTML, CSS, and JavaScript. Discover the best free coding resources for beginners."
        keywords="free coding blog, learn html, javascript tutorials, coding guides"
        url="/blog"
      />
      
      <div className="container mx-auto px-6 py-24 max-w-4xl">
        <h1 className="text-5xl font-syne font-extrabold mb-6">CodLift <span className="text-gradient-cyan">Blog</span></h1>
        <p className="text-xl text-gray-400 mb-16">Tips, tutorials, and guides to help you learn coding for free.</p>
        
        <div className="grid gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard 
                className="cursor-pointer hover:border-cyan/50 transition-all"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{post.title}</h2>
                  <span className="text-sm text-cyan font-mono whitespace-nowrap ml-4">{post.date}</span>
                </div>
                <p className="text-gray-400 leading-relaxed">{post.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
