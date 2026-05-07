import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Highly visible logging for production debugging
    console.error("CRITICAL ERROR DETECTED:");
    console.error(error);
    console.error("Error Info:", errorInfo);
    
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-surface border border-gray-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong.</h2>
            <p className="text-gray-400 mb-4">We're sorry, but an unexpected error occurred. Please try refreshing the page or navigating back.</p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto text-sm font-mono text-red-300 mb-4 whitespace-pre-wrap">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="flex-1 bg-cyan text-background font-semibold py-2 px-4 rounded-lg hover:bg-cyan/90 transition-colors"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="flex-1 bg-surface border border-gray-700 text-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
