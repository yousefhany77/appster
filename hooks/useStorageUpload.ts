"use client";
import { useToast } from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { storage } from "../firebase";

function validateFile(file: File, type: "resumes" | "avatars") {
  const ALLOWED_RESUMES_FILE_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!file) throw new Error("File is required");

  if (file.size > 5 * 1_000_000) throw new Error("File too large");

  if (!ALLOWED_RESUMES_FILE_TYPES.includes(file.type) && type === "resumes")
    throw new Error("File must be pdf or doc");
  if (type === "avatars" && !file.type.startsWith("image/"))
    throw new Error("File must be image");

  return true;
}

function useStorageUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const upload = useCallback(
    async (file: File, uid: string, bucket: "resumes" | "avatars") => {
      if (!validateFile(file, bucket)) return;
      const storageRef = ref(
        storage,
        `${bucket}/${uid}.${
          file.type.split("/")[1] === "pdf" ? "pdf" : "docx"
        }`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);
      const promise = new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            reject(error);
            setUploadProgress(0);
          },
          () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setDownloadURL(downloadURL);
              resolve(downloadURL);
              setUploadProgress(0);
            });
          }
        );
      });
      return promise;
    },
    []
  );

  return { uploadProgress, downloadURL, upload, validateFile };
}

export default useStorageUpload;

/* 

if (typeof error === "string") {
      toast({
        title: "Error",
        description: error,
        status: "error",
        isClosable: true,
        duration: 5000,
      });
      return { error };
    }
    toast({
      title: "Error",
      description: error.message || error.code || "Something went wrong",
      status: "error",
      isClosable: true,
      duration: 5000,
    });
*/
