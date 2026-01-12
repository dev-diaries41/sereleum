export async function uploadPromptsFile(file: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const res = await fetch('/api/prompts/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed: ${text}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error('Error uploading prompts file:', err);
    throw err;
  }
}

export async function clusterPrompts(): Promise<any> {
  try {
    const res = await fetch('/api/prompts/cluster/', {
      method: 'POST',
      body: null,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Clustering failed: ${text}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error('Error clustering prompts:', err);
    throw err;
  }
}
