import React, { useState } from "react";
import { ImageCrop } from "../lib/index";

const Test = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [imgName, setImgName] = useState('');
  const [cropImgScr, setCropImgScr] = useState<string>('');

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setCropImgScr(URL.createObjectURL(file));
    setImgName(file.name);
  };

  const setProfileImage = async (file: File, url: string) => setImgSrc(url);

  return (
    <div>
      <ImageCrop
        imgSrc={cropImgScr}
        imgName={imgName}
        width={512}
        height={512}
        onClick={setProfileImage}
      />

      {imgSrc && <img src={imgSrc} />}

      <input type='file' value={[]} onChange={e => handleUpload(e.target.files?.[0])} />
    </div>
  )
}

export default Test;