// Client-safe upload helper. Sends the file to the server route so AWS
// credentials never reach the browser bundle.

export const uploadFile = async ({
  fileName,
  file,
  object,
}: {
  fileName: string;
  file: File;
  object: string;
}): Promise<string | undefined> => {
  try {
    if (!file || file.size === 0) return undefined;
    if (file.size > 2 * 1024 * 1024) return undefined;

    const form = new FormData();
    form.append("file", file, fileName);
    form.append("object", object);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    if (!res.ok) return undefined;
    const data = (await res.json()) as { url?: string };
    return data.url;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};
