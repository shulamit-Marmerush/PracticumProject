"use client"

import * as React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Camera, ImageIcon, Palette, Zap, Edit, Users, Star, X } from "lucide-react"
import { Link } from "react-router-dom"
import "../styles/HomePage.css" // Import your CSS styles

const HomePage = () => {
  const [showWelcomePopup, setShowWelcomePopup] = useState(true)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const heroTextVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
  }

  type FeatureCardProps = {
    icon: React.ElementType
    title: string
    description: string
    link: string
    delay?: number
  }

  const FeatureCard = ({ icon: Icon, title, description, link, delay = 0 }: FeatureCardProps) => (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
    >
      <Link to={link} className="feature-link">
        <div className="feature-card-icon-wrapper">
          <Icon className="feature-card-icon" />
        </div>
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-description">{description}</p>
        <div className="feature-card-overlay">
          <ArrowRight className="feature-arrow" />
        </div>
      </Link>
    </motion.div>
  )

  type GalleryItemProps = {
    title: string
    image?: string
    link: string
    delay?: number
  }

  const GalleryItem = ({ title, image, link, delay = 0 }: GalleryItemProps) => (
    <motion.div
      className="gallery-item"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
    >
      <Link to={link} className="gallery-link">
        <div className="gallery-image-container">
          <img src={image || "/placeholder.svg"} alt={title} className="gallery-image" />
          <div className="gallery-overlay">
            <Camera className="gallery-icon" />
          </div>
        </div>
        <h4 className="gallery-title">{title}</h4>
      </Link>
    </motion.div>
  )

  // קומפוננטה לאות S
  const SProfileIcon = () => (
    <div className="s-profile-icon">
      <span className="s-letter">S</span>
    </div>
  )

  return (
    <div className="homepage-container">
      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcomePopup && (
          <motion.div
            className="welcome-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWelcomePopup(false)}
          >
            <motion.div
              className="welcome-popup"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="popup-close" onClick={() => setShowWelcomePopup(false)}>
                <X />
              </button>
              <div className="popup-content">
                <Sparkles className="popup-icon" />
                <h2 className="popup-title">Welcome to PhotoClick!</h2>
                <p className="popup-description">
                  Transform your memories into stunning visual stories with our AI-powered tools
                </p>
                <Link to="/Albums" className="popup-button" onClick={() => setShowWelcomePopup(false)}>
                  Get Started
                  <ArrowRight className="popup-button-icon" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section className="hero-section" variants={containerVariants} initial="hidden" animate="visible">
        <div className="hero-background-blobs">
          <div className="blob blob1"></div>
          <div className="blob blob2"></div>
          <div className="blob blob3"></div>
        </div>

        <div className="hero-content-grid">
          <motion.div className="hero-text-content" variants={heroTextVariants}>
            <motion.div className="hero-badge" variants={itemVariants}>
              ✨ New AI Features Available
            </motion.div>
            <motion.h1 className="hero-title" variants={itemVariants}>
              Create <span className="hero-title-highlight">Stunning</span>
              <br />
              Photo Stories
            </motion.h1>
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Transform your memories into breathtaking visual narratives with our cutting-edge AI-powered photo editing
              and collage creation platform.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link to="/Albums" className="hero-cta-button">
                Start Creating
                <ArrowRight className="hero-cta-icon" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="hero-image-placeholders-grid">
            <motion.div
              className="hero-image-card card-1"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
            >
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop"
                alt="Beautiful landscape"
              />
            </motion.div>
            <motion.div
              className="hero-image-card card-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop"
                alt="Nature scene"
              />
            </motion.div>
            <motion.div
              className="hero-image-card card-3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
            >
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop"
                alt="Forest path"
              />
            </motion.div>
            <motion.div
              className="hero-image-card card-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 1, 0.5, 1] }}
            >
              <img
                src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=200&fit=crop"
                alt="Ocean view"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="section-badge">🔮 Powerful Features</div>
          <h2 className="section-title gradient-text-purple-pink">Explore Our Tools</h2>
          <p className="section-subtitle">Discover all the amazing features PhotoClick has to offer</p>
        </motion.div>
        <div className="features-grid">
          <FeatureCard
            icon={Palette}
            title="AI Collage Creator"
            description="Create stunning collages with our advanced AI that automatically arranges your photos for maximum visual impact."
            link="/College"
            delay={0}
          />
          <FeatureCard
            icon={Camera}
            title="AI Image Generator"
            description="Generate unique artwork and images using cutting-edge AI technology. Turn your ideas into visual reality."
            link="/ai-generator"
            delay={0.2}
          />
          <FeatureCard
            icon={ImageIcon}
            title="Smart Albums"
            description="Organize your photos intelligently with our smart album system. Keep your memories perfectly sorted."
            link="/Albums"
            delay={0.4}
          />
          <FeatureCard
            icon={Zap}
            title="Quick Upload"
            description="Upload and organize your photos instantly with our lightning-fast upload system and smart categorization."
            link="/UploadFile"
            delay={0.6}
          />
          <FeatureCard
            icon={Edit}
            title="AI Assistant"
            description="Get help with editing, organizing, and creating content with our intelligent AI assistant."
            link="/chat"
            delay={0.8}
          />
          <FeatureCard
            icon={Users}
            title="Easy Sharing"
            description="Share your creations with friends and family across all platforms with our seamless sharing tools."
            link="/Albums"
            delay={1.0}
          />
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="gallery-showcase-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="section-title gradient-text-pink-purple-indigo">Inspiring Creations</h2>
          <p className="section-subtitle">See what's possible with PhotoClick</p>
        </motion.div>
        <div className="gallery-grid">
          <GalleryItem
            title="Family Memories"
            image="../images/c1.jpg"
            link="/Albums"
            delay={0}
          />
          <GalleryItem
            title="Wedding Dreams"
            image="https://www.trask.co.il/wp-content/uploads/2023/07/weddings-1350x900.jpg"
            link="/Albums"
            delay={0.15}
          />
          <GalleryItem
            title="Adventure Stories"
            image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            link="/Albums"
            delay={0.3}
          />
          <GalleryItem
            title="Celebration Moments"
            image="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop"
            link="/Albums"
            delay={0.45}
          />
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="section-title gradient-text-purple-pink">
            Loved by <span className="text-white">Creators</span>
          </h2>
        </motion.div>
        <motion.div
          className="testimonial-card"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="testimonial-quote-mark">"</div>
          <p className="testimonial-text">
            PhotoClick has completely transformed how I create and share my family memories. The AI features are
            incredible, and the results are always stunning!
          </p>
          <div className="testimonial-author-info">
            <SProfileIcon />
            <div>
              <h4 className="testimonial-author-name">Sarah Johnson</h4>
              <p className="testimonial-author-title">Professional Photographer</p>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star-icon" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="cta-title">
            Ready to Create <span className="gradient-text-pink-purple-indigo-alt">Magic?</span>
          </h2>
          <p className="cta-subtitle">
            Join thousands of creators who are already transforming their photos into stunning visual stories.
          </p>
          <Link to="/register" className="cta-button-alt">
            Start Your Journey
            <Sparkles className="cta-button-icon" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default HomePage