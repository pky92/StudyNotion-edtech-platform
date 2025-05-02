import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { useSelector } from "react-redux";

import "video-react/dist/video-react.css";
import { Player } from "video-react";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const inputRef = useRef(null);

  // Function to preview file
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
      setValue(name, file);  // Set the selected file in the form
    };
  };

  // Function to handle file drop
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
    }
  };

  // Function to open the file browser
  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: video ? "video/*" : "image/*",
    onDrop,
  });

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5">{label}</label>
      <div
        {...getRootProps({
          className: "flex items-center justify-center w-full h-36 border border-dashed cursor-pointer",
          onClick: handleBrowseClick,  // Trigger the file input on click
        })}
      >
        <input {...getInputProps()} ref={inputRef} {...register(name, )} />
        
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : previewSource ? (
          video ? (
            <Player src={previewSource} fluid={false} width={200} height={200} />
          ) : (
            <img src={previewSource} alt="Preview" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="text-center">
            <FiUploadCloud className="text-3xl" />
            <p className="mt-2">Drag & drop or click to browse</p>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="text-pink-200 text-xs">{`${label} is required`}</span>
      )}
    </div>
  );
}
