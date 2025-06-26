import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 Error Boundary Caught:", error, errorInfo);

    // Log to security monitor if available
    try {
      import("@/utils/securityMonitor").then(({ securityMonitor }) => {
        securityMonitor.logSecurityEvent({
          type: "navigation",
          level: "error",
          message: `React Error Boundary: ${error.message}`,
          timestamp: new Date().toISOString(),
          metadata: {
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            url: window.location.href,
          },
        });
      });
    } catch (e) {
      console.warn("Could not log to security monitor:", e);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleGoBack = () => {
    window.history.back();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <Card className="border-red-200 shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-red-800">
                  🦁 Oops! Something Went Wrong
                </CardTitle>
                <p className="text-red-600 text-lg mt-2">
                  Even the mightiest lions encounter unexpected challenges
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Error Details:</strong>{" "}
                    {this.state.error?.message || "Unknown error occurred"}
                  </AlertDescription>
                </Alert>

                {/* Development Mode Details */}
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                      🔍 Technical Details (Development Mode)
                    </summary>
                    <div className="mt-3 p-3 bg-gray-100 rounded text-xs overflow-auto">
                      <div className="mb-2">
                        <strong>Error:</strong>
                        <pre className="mt-1 text-red-600">
                          {this.state.error.stack}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 text-blue-600">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={this.handleReload}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </Button>

                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>

                  <Button
                    onClick={this.handleGoBack}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                </div>

                {/* Deployment-Specific Help */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    🚀 Deployment Notes
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• This error has been logged for monitoring</li>
                    <li>
                      • Try refreshing the page if this is a temporary issue
                    </li>
                    <li>• If the error persists, contact support</li>
                    <li>• Check browser console for additional details</li>
                  </ul>
                </div>

                {/* Wildlife Wisdom */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                  <div className="text-center">
                    <p className="text-sm text-amber-800 italic">
                      "🐘 <strong>Elephant Wisdom:</strong> Every challenge is
                      an opportunity to grow stronger. The pride will be back on
                      its feet in no time!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
