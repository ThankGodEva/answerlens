// import React, { useState, useRef } from 'react';
import { useState, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './app.css';

type HistoryItem = {
  id: string;
  image: string;
  answers: string;
  timestamp: number;
};

function dataURLtoFile(dataUrl: string, filename: string) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}


export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'history'>('home');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [answers, setAnswers] = useState('');
  const [loading, setLoading] = useState(false);

  const N8N_WEBHOOK_URL = 'https://n8n.srv1108528.hstgr.cloud/webhook/64c7f83c-2ebb-4c9e-a3cf-2b6ce2db80d0';

  // Crop states
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setIsCropping(true);
      setAnswers('');
    };
    reader.readAsDataURL(file);
  };

  const confirmCrop = () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX =
      imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY =
      imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width!;
    canvas.height = completedCrop.height!;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x! * scaleX,
      completedCrop.y! * scaleY,
      completedCrop.width! * scaleX,
      completedCrop.height! * scaleY,
      0,
      0,
      completedCrop.width!,
      completedCrop.height!
    );

    const croppedImage = canvas.toDataURL('image/jpeg');

    setImage(croppedImage);
    setIsCropping(false);
    setAnswers('Image cropped successfully. Ready for AI processing.');
  };

  const switchTab = (tab: 'home' | 'history') => {
    setActiveTab(tab);

    if (tab === 'home') return;

    setImage(null);
    setRawImage(null);
    setIsCropping(false);
    setAnswers('');
  };

  const sendToWorkflow = async () => {
    if (!image) return;

    try {
      setLoading(true);
      setAnswers('Processing image...');

      const file = dataURLtoFile(image, 'capture.jpg');

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Workflow request failed');
      }

      const text = await res.text();
      setAnswers(text);

      // ✅ SAVE TO HISTORY
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          image,
          answers: text,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    } catch (err) {
      setAnswers('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const previewText = (text: string, max = 120) =>
  // text.length > max ? text.slice(0, max) + '...' : text;


  return (
    <div className="container">
      {/* Tabs */}
      <div className="tabBar">
        <button
          className={`tabButton ${activeTab === 'home' ? 'activeTab' : ''}`}
          onClick={() => switchTab('home')}
        >
          Home
        </button>
        <button
          className={`tabButton ${activeTab === 'history' ? 'activeTab' : ''}`}
          onClick={() => switchTab('history')}
        >
          History
        </button>
      </div>

      <div className="scroll">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            <h1 className="title">AnswerLens AI</h1>
            <p className="subtitle">
              Take a photo or choose from gallery
            </p>

            <div className="buttonRow">
              <label className="button">
                📸 Camera
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) =>
                    e.target.files &&
                    handleFile(e.target.files[0])
                  }
                />
              </label>

              <label className="buttonAlt">
                🖼️ Gallery
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    e.target.files &&
                    handleFile(e.target.files[0])
                  }
                />
              </label>
            </div>

            {/* CROPPER */}
            {isCropping && rawImage && (
              <div style={{ marginTop: 20 }}>
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img
                    src={rawImage}
                    ref={imgRef}
                    style={{ maxWidth: '100%' }}
                  />
                </ReactCrop>

                <div
                  className="buttonRow"
                  style={{ marginTop: 15 }}
                >
                  <button
                    className="buttonAlt"
                    onClick={confirmCrop}
                  >
                    Confirm Crop
                  </button>
                </div>
              </div>
            )}

            {/* PREVIEW */}
            {image && !isCropping && (
              <>
                <img src={image} className="image" />

                <div className="buttonRow" style={{ marginTop: 12 }}>
                  <button
                    className="button"
                    onClick={sendToWorkflow}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Analyze Image'}
                  </button>
                </div>
              </>
            )}


            {answers && (
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  textAlign: 'left',
                  marginTop: 12,
                  fontFamily: 'inherit',
                  color: '#111',        // 👈 ADD THIS
                  background: '#ffffff',
                  padding: '12px',
                  borderRadius: '8px',
                  lineHeight: '1.5',
                }}
              >
                {answers}
              </pre>
            )}

          </>
        )}

        {activeTab === 'history' && (
          <>
            <h1 className="title">History</h1>
            <p className="subtitle">Your previous answers</p>

            {history.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666' }}>
                No saved history yet.
              </p>
            )}

            {history.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                  style={{
                    background: '#fff',
                    padding: 12,
                    borderRadius: 12,
                    marginBottom: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {/* Image thumbnail */}
                  <img
                    src={item.image}
                    style={{
                      width: '100%',
                      height: isExpanded ? 220 : 140,
                      objectFit: 'contain',
                      borderRadius: 8,
                      marginBottom: isExpanded ? 10 : 0,
                      transition: 'height 0.25s ease',
                    }}
                  />

                  {/* Full answer ONLY when expanded */}
                  {isExpanded && (
                    <>
                      <pre
                        style={{
                          whiteSpace: 'pre-wrap',
                          color: '#111',
                          fontFamily: 'inherit',
                          fontSize: 14,
                          lineHeight: 1.5,
                          marginTop: 8,
                        }}
                      >
                        {item.answers}
                      </pre>

                      <div
                        style={{
                          marginTop: 8,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <small style={{ color: '#777' }}>
                          {new Date(item.timestamp).toLocaleString()}
                        </small>

                        <small style={{ color: '#007AFF', fontWeight: 500 }}>
                          Tap to collapse
                        </small>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}

      </div>
    </div>
  );
}