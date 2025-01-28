'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [transcript, setTranscript] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setImageUrl('')

    try {
      // Get analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      })

      const data = await response.json()
      setResult(data.result)

      // Generate image from analysis
      const imageResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: data.result })
      })

      const imageData = await imageResponse.json()
      if (imageData.imageUrl) {
        setImageUrl(imageData.imageUrl)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>
            Transcript Analysis
          </h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label htmlFor="transcript" className={styles.label}>
                Enter your transcript
              </label>
              <textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className={styles.textarea}
                placeholder="Enter your transcript here..."
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? (
                <span className={styles.loadingWrapper}>
                  <svg className={styles.spinner} viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyzing...
                </span>
              ) : 'Analyze Transcript'}
            </button>
          </form>

          {result && (
            <div className={styles.result}>
              <h2 className={styles.resultTitle}>Analysis Result</h2>
              <p className={styles.resultText}>{result}</p>
              {imageUrl && (
                <div className={styles.imageContainer}>
                  <h3 className={styles.imageTitle}>Visual Summary</h3>
                  <img
                    src={imageUrl}
                    alt="Analysis visualization"
                    className={styles.resultImage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
