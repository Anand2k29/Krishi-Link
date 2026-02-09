import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6 border border-gray-100">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle size={32} />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-800">Something went wrong</h2>
                            <p className="text-gray-500 text-sm">
                                We're sorry, but an unexpected error occurred.
                            </p>
                        </div>

                        {this.state.error && (
                            <div className="text-left bg-gray-100 p-4 rounded-lg overflow-auto max-h-40 text-xs text-mono text-gray-700">
                                <p className="font-bold text-red-800 mb-1">{this.state.error.toString()}</p>
                                {this.state.errorInfo && (
                                    <div style={{ whiteSpace: 'pre-wrap' }}>
                                        {this.state.errorInfo.componentStack}
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={this.handleReload}
                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                        >
                            <RefreshCw size={18} className="mr-2" />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
