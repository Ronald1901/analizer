/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

import React, {forwardRef, useEffect, useState} from 'react';
import {parseJSON} from '@/lib/parse';
import {getAnalysisFromVideoPrompt} from '@/lib/prompts';
import {generateText} from '@/lib/textGeneration';

interface ContentContainerProps {
  contentBasis: string;
  onLoadingStateChange?: (isLoading: boolean) => void;
  language: string;
}

type LoadingState = 'loading' | 'ready' | 'error';

export default forwardRef(function ContentContainer(
  {contentBasis, onLoadingStateChange, language}: ContentContainerProps,
  ref,
) {
  const [analysis, setAnalysis] = useState<string>('');
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);

  // Helper function to generate content spec from video
  const generateAnalysisFromVideo = async (
    videoUrl: string,
    analysisLanguage: string,
  ): Promise<string> => {
    const prompt = getAnalysisFromVideoPrompt(analysisLanguage);
    const response = await generateText({
      modelName: 'gemini-2.5-pro',
      prompt,
      videoUrl: videoUrl,
      isJson: true,
    });

    const analysisResult = parseJSON(response).analysis;
    return analysisResult;
  };

  // Propagate loading state changes as a boolean
  useEffect(() => {
    if (onLoadingStateChange) {
      const isLoading = loadingState === 'loading';
      onLoadingStateChange(isLoading);
    }
  }, [loadingState, onLoadingStateChange]);

  // On mount (or when contentBasis changes), generate the analysis
  useEffect(() => {
    async function generateContent() {
      try {
        setLoadingState('loading');
        setError(null);
        setAnalysis('');

        const generatedAnalysis = await generateAnalysisFromVideo(
          contentBasis,
          language,
        );
        setAnalysis(generatedAnalysis);
        setLoadingState('ready');
      } catch (err) {
        console.error(
          'An error occurred while attempting to generate content:',
          err,
        );
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
        setLoadingState('error');
      }
    }

    generateContent();
  }, [contentBasis, language]);

  const renderLoadingSpinner = () => (
    <div
      style={{
        alignItems: 'center',
        color: '#666',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        marginTop: '-2.5rem',
      }}>
      <div className="loading-spinner"></div>
      <p
        style={{
          color: 'light-dark(#787878, #f4f4f4)',
          fontSize: '1.125rem',
          marginTop: '20px',
        }}>
        Analyzing video and generating script structure...
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div
      style={{
        alignItems: 'center',
        color: 'var(--color-error)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        marginTop: '-2.5rem',
        textAlign: 'center',
      }}>
      <div
        style={{
          fontFamily: 'var(--font-symbols)',
          fontSize: '5rem',
        }}>
        error
      </div>
      <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Error</h3>
      <p>{error || 'Something went wrong'}</p>
      {!contentBasis.startsWith('http://') &&
      !contentBasis.startsWith('https://') ? (
        <p style={{marginTop: '0.5rem'}}>
          (<strong>NOTE:</strong> URL must begin with http:// or https://)
        </p>
      ) : null}
    </div>
  );

  const renderAnalysis = () => (
    <div
      style={{
        whiteSpace: 'pre-wrap',
        fontFamily: 'var(--font-technical)',
        lineHeight: 1.75,
        height: '100%',
        overflow: 'auto',
        padding: '1rem 2rem',
        boxSizing: 'border-box',
      }}>
      {analysis}
    </div>
  );

  const renderContent = () => {
    switch (loadingState) {
      case 'loading':
        return renderLoadingSpinner();
      case 'error':
        return renderErrorState();
      case 'ready':
        return renderAnalysis();
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        border: '2px solid light-dark(#000, #fff)',
        borderRadius: '8px',
        boxSizing: 'border-box',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}>
      {renderContent()}
      <style>{`
        .loading-spinner {
          animation: spin 1s ease-in-out infinite;
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: var(--color-accent);
          height: 60px;
          width: 60px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
});