'use client';

import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [secret, setSecret] = useState('');
  const [fileName, setFileName] = useState(''); // State to hold the file name
  const correctSecret = "hh";

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (secret !== correctSecret) { // Ensure this secret is managed securely in a real application
            alert('Incorrect secret word!');
            return;
          }

          if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
          }

          const file = inputFileRef.current.files[0];
          setFileName(file.name); // Set file name when file is selected

          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/avatar/upload',
          });

          setBlob(newBlob);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}
      >
        <input
          type="password"
          placeholder="Enter secret word"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
        />
        <input
          name="file"
          ref={inputFileRef}
          type="file"
          onChange={event => setFileName(event.target.files?.[0]?.name || '')}
          required
        />
        <button type="submit">Upload</button>
      </form>

      {blob && (
        <div style={{ marginTop: '20px' }}>
          <strong>Uploaded File:</strong> {fileName}
          <div>Blob URL: <a href={blob.url} target="_blank" rel="noopener noreferrer">{blob.url}</a></div>
        </div>
      )}
    </>
  );
}
