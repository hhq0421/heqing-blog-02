'use client';

import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [secret, setSecret] = useState(''); // State to hold the secret word input
  const correctSecret = "heqing"; // This should be the secret word you expect

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (secret !== correctSecret) {
            alert('Incorrect secret word!');
            return; // Prevent upload if the secret word is incorrect
          }

          if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
          }

          const file = inputFileRef.current.files[0];

          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/avatar/upload',
          });

          setBlob(newBlob);
        }}
      >
        <input
          type="password" // Use password type to hide input
          placeholder="Enter secret word"
          value={secret}
          onChange={(e) => setSecret(e.target.value)} // Update state on input change
          required
        />
        <input
          name="file"
          ref={inputFileRef}
          type="file"
          required
        />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}
