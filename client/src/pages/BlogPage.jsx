import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../utils/SEO';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { blogPosts } from '../content/blogData';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '../components/ui/Core';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

const BlogCard = ({ post }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group"
  >
    <Link to={`/blog/${post.slug}`}>
      <GlassCard className="h-full flex flex-col p-6 hover:border-purple/30 transition-colors" hover={true}>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-purple/10 text-purple text-[10px] font-bold uppercase tracking-widest">
            {post.category}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase">
            <Calendar className="w-3 h-3" /> {post.date}
          </div>
        </div>
        <h3 className="text-2xl font-syne font-extrabold mb-3 group-hover:text-purple transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <User className="w-3 h-3" /> {post.author}
          </div>
          <div className="text-purple text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Read More <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </GlassCard>
    </Link>
  </motion.div>
);

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-purple/30">
      <SEO 
        title="Coding Blog & Resources | CodLift"
        description="Level up your engineering career with our latest articles on web development, interactive learning, and productivity tips."
        url="/blog"
      />
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <header className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-bold mb-6"
            >
              <BookOpen className="w-3 h-3" /> KNOWLEDGE HUB
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-syne font-extrabold tracking-tight mb-8">
              The <span className="text-gradient-purple">CodLift</span> Blog
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Deep dives into modern tech, learning science, and strategies 
              to help you ship better software, faster.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Newsletter / CTA */}
          <GlassCard className="mt-24 p-12 text-center border-white/5 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-syne font-extrabold mb-4">Never miss an update</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Get the latest coding tips and platform updates delivered 
                straight to your inbox once a week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-navy/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple/50"
                />
                <Button className="px-8 rounded-2xl">Subscribe</Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple/5 blur-[100px] rounded-full" />
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
