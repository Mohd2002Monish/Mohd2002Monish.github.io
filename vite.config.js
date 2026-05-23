import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Vite plugin to serve portfolio data read/write API
function portfolioDataPlugin() {
  const dataFile = path.resolve('./src/data/portfolio-data.json')
  return {
    name: 'portfolio-data-api',
    configureServer(server) {
      server.middlewares.use('/api/portfolio', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
          return
        }

        if (req.method === 'GET') {
          try {
            const data = fs.readFileSync(dataFile, 'utf-8')
            res.statusCode = 200
            res.end(data)
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Failed to read data' }))
          }
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body)
              fs.writeFileSync(dataFile, JSON.stringify(parsed, null, 2))
              res.statusCode = 200
              res.end(JSON.stringify({ success: true }))
            } catch (e) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Failed to write data' }))
            }
          })
        } else {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
        }
      })
    }
  }
}

export default defineConfig({
  base: '/dev-monish-portfolio/',
  plugins: [react(), portfolioDataPlugin()],
  server: {
    watch: {
      ignored: ['**/src/data/portfolio-data.json'],
    },
  },
})
