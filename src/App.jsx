import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { PortfolioProvider } from './context/PortfolioContext'
import { CometProvider } from './context/CometContext'

import ScrollProgressBar from './components/ScrollProgressBar'
import ParticleBackground from './components/ParticleBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'

import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AllProjects from './pages/AllProjects'

function Portfolio() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

function AdminGuard() {
  const navigate = useNavigate()
  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== 'true') {
      navigate('/admin')
    }
  }, [navigate])
  return <AdminDashboard />
}

export default function App() {
  return (
    <PortfolioProvider>
      <CometProvider>
      <ScrollProgressBar />
      <ParticleBackground />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--x-surface)',
              color: 'var(--x-text)',
              border: '1px solid var(--x-line)',
              borderRadius: '3px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#ff5c1a', secondary: '#0a0a0b' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#0a0a0b' },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminGuard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </CometProvider>
    </PortfolioProvider>
  )
}
