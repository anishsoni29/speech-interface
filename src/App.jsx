// App.jsx
import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Alert, AlertDescription } from './components/ui/Alert';
import ImageGallery from './components/ui/imageGallery';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');
  const [images, setImages] = useState([]);

  useEffect(() => {
    checkServerStatus();
    fetchImages();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/status');
      const data = await response.json();
      setServerStatus(data.status === 'Server is running' ? 'connected' : 'disconnected');
    } catch (err) {
      setServerStatus('disconnected');
      setError('Cannot connect to server');
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/images');
      const data = await response.json();
      setImages(data.images);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  const handleRecord = async () => {
    setIsRecording(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5002/api/recognize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'en-US'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResponse(data.response_text);
        setImages(data.images);

        // Play the audio response
        if (data.audio_url) {
          const audio = new Audio(data.audio_url);
          audio.play();
        }
      } else {
        setError(data.error || 'Failed to recognize speech');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Speech Recognition Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleRecord}
                  disabled={isRecording || serverStatus === 'disconnected'}
                  className={`h-16 w-16 rounded-full ${
                    isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="h-8 w-8 text-white" />
                  ) : (
                    <Mic className="h-8 w-8 text-white" />
                  )}
                </Button>
                <div className="text-sm text-gray-500">
                  {isRecording ? 'Recording...' : 'Click to start recording'}
                </div>
              </div>

              {serverStatus === 'disconnected' && (
                <Alert variant="destructive" className="w-full">
                  <AlertDescription>
                    Cannot connect to server. Please make sure the backend is running on port 5002.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="w-full">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {response && (
                <Card className="w-full">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Assistant Response:</h3>
                      <p className="text-gray-700">{response}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        <ImageGallery images={images} response={response} language="en-US" setLanguage={() => {}} />
      </div>
    </div>
  );
};

export default App;
