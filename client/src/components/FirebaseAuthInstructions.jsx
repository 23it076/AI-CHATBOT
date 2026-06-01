import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const FirebaseAuthInstructions = () => {
  const [domain, setDomain] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for the unauthorized domain error in the console logs
    if (window.location) {
      setDomain(window.location.hostname);
    }

    // Check if we've already shown this message in this session
    const hasSeenInstructions = sessionStorage.getItem('firebase-auth-instructions-seen');
    if (!hasSeenInstructions) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Mark as seen for this session
    sessionStorage.setItem('firebase-auth-instructions-seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <Alert className="mb-6">
      <AlertTitle>Google Sign-In Configuration Required</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          To enable Google Sign-In, you need to add your Replit domain to Firebase authorized domains:
        </p>
        <ol className="list-decimal pl-5 mb-4 space-y-1">
          <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Firebase Console</a></li>
          <li>Select your project</li>
          <li>Navigate to Authentication &gt; Settings &gt; Authorized domains</li>
          <li>Click "Add domain" and enter: <code className="bg-gray-100 px-1 rounded">{domain}</code></li>
          <li>After deployment, add your replit.app domain or custom domain as well</li>
        </ol>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>);

};

export default FirebaseAuthInstructions;