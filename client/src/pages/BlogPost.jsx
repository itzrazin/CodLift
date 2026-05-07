import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SEO } from '../utils/SEO';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { blogPosts } from '../content/blogData';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/Core';
import { Calendar, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { AdSenseBlock } from '../components/AdSenseBlock';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-cyan/30">
      <SEO 
        title={`${post.title} | CodLift Blog`}
        description={post.description}
        url={`/blog/${post.slug}`}
      />
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <article className="container mx-auto max-w-3xl">
          {/* Header */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan transition-colors mb-10 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-cyan/10 text-cyan text-[10px] font-bold uppercase tracking-widest">
                {post.category}
              </span>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</span>
                <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {post.author}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-syne font-extrabold tracking-tight leading-tight mb-8">
              {post.title}
            </h1>

            <div className="flex items-center justify-between py-6 border-y border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-navy border border-white/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-bold">{post.author}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Technical Writer</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <Share2 className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <Bookmark className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </header>

          <AdSenseBlock slot="blog_post_top" format="horizontal" />

          {/* Content */}
          <div className="prose prose-invert prose-cyan max-w-none prose-h2:font-syne prose-h2:font-extrabold prose-h2:text-3xl prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg prose-strong:text-white prose-li:text-gray-300">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Footer of article */}
          <footer className="mt-20 pt-10 border-t border-white/5">
            <h3 className="text-xl font-syne font-extrabold mb-6">Read more from CodLift</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map(p => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="block group">
                  <GlassCard className="p-6 h-full group-hover:border-cyan/30 transition-colors">
                    <h4 className="font-syne font-bold mb-2 group-hover:text-cyan transition-colors line-clamp-1">{p.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{p.excerpt}</p>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
