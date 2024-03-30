import { ChangeEvent, useState } from "react";

const Chunked = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [cldResponse, setCldResponse] = useState(null);
  //type for event

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // create a blob object from the file

    if (event.target.files) {
      const file = event.target.files[0];
      setFile(file);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      console.error("Please select a file.");
      return;
    }

    const uniqueUploadId = generateUniqueUploadId();
    const chunkSize = 100 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    setUploading(true);

    const uploadChunk = async (start: number, end: number) => {
      //return if file is null
      if (!file) {
        return;
      }
      //max 100mb size
      if (file.size > 100 * 1024 * 1024) {
        console.error("File is too large. Max size is 100MB.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file.slice(start, end));
      formData.append("filename", file.name);
      formData.append("uniqueId", uniqueUploadId);
      // MIME type
      formData.append("mimeType", file.type);
      // formData.append("totalChunks", totalChunks.toString());
      // formData.append("chunkIndex", currentChunk.toString());

      console.log(
        `Uploading chunk for uniqueUploadId: ${uniqueUploadId}; start: ${start}, end: ${
          end - 1
        }`
      );

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDIA_ENDPOINT}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Chunk upload failed.");
        }

        currentChunk++;

        if (currentChunk < totalChunks) {
          const nextStart = currentChunk * chunkSize;
          const nextEnd = Math.min(nextStart + chunkSize, file.size);
          uploadChunk(nextStart, nextEnd);
        } else {
          setUploadComplete(true);
          setUploading(false);
          const fetchResponse = await response.json();
          setCldResponse(fetchResponse);
          console.info("File upload complete.");
        }
      } catch (error) {
        console.error("Error uploading chunk:", error);
        setUploading(false);
      }
    };

    const start = 0;
    const end = Math.min(chunkSize, file.size);
    uploadChunk(start, end);
  };

  const generateUniqueUploadId = () => {
    return `uqid-${Date.now()}`;
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadComplete && cldResponse && (
        <div>
          <span className="left">
            <p>Upload response:</p>
            <pre>{JSON.stringify(cldResponse, null, 2)}</pre>
          </span>
        </div>
      )}
    </>
  );
};

export default Chunked;
