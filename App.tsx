/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

import ContentContainer from '@/components/ContentContainer';
import {getYoutubeEmbedUrl, validateYoutubeUrl} from '@/lib/youtube';
import {useRef, useState} from 'react';

// Whether to validate the input URL before attempting to generate content
const VALIDATE_INPUT_URL = true;

// Helper function to load a shared state by ID
export default function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('Português (Brasil)');

  const [urlValidating, setUrlValidating] = useState(false); // State to track URL validation
  const [contentLoading, setContentLoading] = useState(false); // State to track content loading

  // Counter to force ContentContainer re-mount even if the video URL hasn't changed
  const [reloadCounter, setReloadCounter] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle 'Enter' key press in the input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !urlValidating && !contentLoading) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const inputValue = inputRef.current?.value.trim() || '';

    if (!inputValue) {
      inputRef.current?.focus();
      return;
    }

    // Prevent multiple clicks while validating
    if (urlValidating) return;

    setUrlValidating(true);
    setVideoUrl(''); // Clear previous video URL immediately
    setContentLoading(false); // Reset content loading state

    if (VALIDATE_INPUT_URL) {
      // Validate video URL
      const validationResult = await validateYoutubeUrl(inputValue);

      if (validationResult.isValid) {
        proceedWithVideo(inputValue);
      } else {
        alert(validationResult.error || 'Invalid YouTube URL');
        setUrlValidating(false);
      }
    } else {
      // If URL validation is disabled, proceed directly
      proceedWithVideo(inputValue);
    }
  };

  // Helper function to handle common operations after URL validation
  const proceedWithVideo = (url: string) => {
    setVideoUrl(url);
    // Incrementing the counter changes the 'key' prop on ContentContainer,
    // forcing it to re-mount and re-generate content
    setReloadCounter((c) => c + 1);
    setUrlValidating(false);
  };

  // Callback function to handle loading state changes from ContentContainer
  const handleContentLoadingStateChange = (isLoading: boolean) => {
    setContentLoading(isLoading);
  };

  return (
    <>
      <main className="main-container">
        <div className="left-side">
          <h1 className="headline">Video Script Analyzer</h1>
          <p className="subtitle">
            Get a scene-by-scene script and story structure analysis from any
            YouTube video.
          </p>
          <p className="attribution">
            An experiment by <strong>Aaron Wade</strong>
          </p>
          <div className="input-container">
            <div className="input-header">
              <label htmlFor="youtube-url" className="input-label">
                Paste a URL from YouTube:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
                disabled={urlValidating || contentLoading}>
                <option value="Português (Brasil)">Português (Brasil)</option>
                <option value="English">English</option>
                <option value="Español">Español</option>
              </select>
            </div>
            <input
              ref={inputRef}
              id="youtube-url"
              className="youtube-input"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              defaultValue={''}
              disabled={urlValidating || contentLoading} // Disable input while validating or loading
              onKeyDown={handleKeyDown} // Add keydown handler
              onChange={() => {
                // Clear all content upon input change
                setVideoUrl('');
              }}
            />
          </div>

          <div className="button-container">
            <button
              onClick={handleSubmit}
              className="button-primary submit-button"
              disabled={urlValidating || contentLoading} // Disable button during validation or content loading
            >
              {urlValidating
                ? 'Validating URL...'
                : contentLoading
                  ? 'Analyzing...'
                  : 'Analyze Video'}
            </button>
          </div>

          <div className="video-container">
            {videoUrl ? (
              <iframe
                className="video-iframe"
                src={getYoutubeEmbedUrl(videoUrl)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
            ) : (
              <div className="video-placeholder">Video will appear here</div>
            )}
          </div>
        </div>

        <div className="right-side">
          <div className="content-area">
            {videoUrl ? (
              <ContentContainer
                key={reloadCounter}
                contentBasis={videoUrl}
                onLoadingStateChange={handleContentLoadingStateChange}
                language={language}
              />
            ) : (
              <div className="content-placeholder">
                <p>
                  {urlValidating
                    ? 'Validating URL...'
                    : 'Paste a YouTube URL to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .main-container {
          --color-headline: light-dark(#000, #fff);
          --color-subtitle: light-dark(#666, #c8c8c8);
          --color-attribution: light-dark(#999, #e1e1e1);

          --color-video-container-background: light-dark(#f0f0f0, #f4f4f4);

          --color-video-placeholder-text: light-dark(#787878, #4d4d4d);

          --color-content-placeholder-border: light-dark(#ccc, #9a9b9c);
          --color-content-placeholder-text: light-dark(#787878, #f4f4f4);

          padding: 2rem;
          display: flex;
          gap: 2rem;
          height: 100vh;
          box-sizing: border-box;
          overflow: hidden;

          @media (max-width: 768px) {
            flex-direction: column;
            padding: 2.25rem 1.5rem 1.5rem;
            gap: 1rem;
            height: auto;
            overflow: visible;
          }
        }

        .left-side {
          width: 40%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          overflow-y: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */

          @media (max-width: 768px) {
            width: 100%;
            height: auto;
            overflow: visible;
          }
        }

        .left-side::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .right-side {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 1rem;
          height: 100%;

          @media (max-width: 768px) {
            height: auto;
          }
        }


        .headline {
          color: var(--color-headline);
          font-family: var(--font-display);
          font-size: 4rem;
          font-weight: 400;
          margin-top: 0.5rem;
          margin-bottom: 0;
          text-align: center;
          text-transform: uppercase;

          @media (max-width: 768px) {
            font-size: 2.625rem;
            margin-top: 0;
          }
        }

        .subtitle {
          color: var(--color-subtitle);
          font-size: 1.2rem;
          margin-top: -0.5rem;
          margin-bottom: 0;
          text-align: center;

          @media (max-width: 768px) {
            font-size: 0.875rem;
          }
        }

        .attribution {
          color: var(--color-attribution);
          font-family: var(--font-secondary);
          font-size: 0.9rem;
          font-style: italic;
          margin-bottom: 1rem;
          margin-top: -0.5rem;
          text-align: center;

          @media (max-width: 768px) {
            font-size: 0.8rem;
          }
        }

        .input-container {
          width: 100%;
        }

        .input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .language-select {
          background-color: var(--color-background);
          border: 1px solid var(--color-border, light-dark(#ccc, #e5e5e5));
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          color: var(--color-text);
          transition: border-color 0.2s;
        }

        .language-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .language-select:focus {
          outline: 1px solid var(--color-accent);
        }

        .input-label {
          display: block;
        }

        .youtube-input {
          width: 100%;
        }

        .button-container {
          width: 100%;
          display: flex;
          gap: 0.5rem;
        }

        .submit-button {
          flex: 1;
        }

        .share-button {
          flex: 0.05;
        }

        .video-container {
          background-color: var(--color-video-container-background);
          border-radius: 8px;
          color: var(--color-video-placeholder-text);
          margin: 0.5rem 0;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          position: relative;
          width: 100%;
        }

        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 8px;
        }

        .video-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-height: 100%;

          @media (max-width: 768px) {
            max-height: 550px;
            min-height: 550px;
          }
        }

        .content-placeholder {
          align-items: center;
          border: 2px dashed var(--color-content-placeholder-border);
          border-radius: 8px;
          box-sizing: border-box;
          color: var(--color-content-placeholder-text);
          display: flex;
          flex-direction: column;
          font-size: 1.2rem;
          height: 100%;
          justify-content: center;
          padding: 0 2rem;
          width: 100%;

          @media (max-width: 768px) {
            min-height: inherit;
          }
        }

        .gallery-container {
          width: 100%;
        }

        .desktop-gallery-container {
          display: block;

          @media (max-width: 768px) {
            display: none; /* Hide on mobile */
          }
        }

        .mobile-gallery-container {
          display: none; /* Hide on desktop */

          @media (max-width: 768px) {
            display: block;
          }
        }
      `}</style>
    </>
  );
}