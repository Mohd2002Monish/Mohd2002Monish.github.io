import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { PortfolioProvider } from './context/PortfolioContext'

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
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111d35',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#06b6d4', secondary: '#0a0f1e' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#0a0f1e' },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminGuard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  )
}
