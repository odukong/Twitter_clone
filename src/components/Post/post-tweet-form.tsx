import React, { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const TextArea = styled.textarea`
  border-left: 0;
  border-right: 0;
  border-top: 0.1rem solid #e2e2e2;
  border-bottom: 0.1rem solid #e2e2e2;
  padding: 2rem;
  font-size: 1.6rem;
  width: 100%;
  resize: none;

  &:focus {
    outline: none;
    border-left: 0;
    border-right: 0;
    border-top: 0.1rem solid #e2e2e2;
    border-bottom: 0.1rem solid #e2e2e2;
  }
`;

const ImageList = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0 3rem;
`;

const ImageBox = styled.div`
  position: relative;
  width: 20rem;
  height: 20rem;
  svg {
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const FormTool = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
`;

const AttachFileButton = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  cursor: pointer;
  svg {
    width: 3rem;
  }
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #ffc400;
  color: white;
  border: none;
  border-radius: 3rem;
  padding: 0.8rem 2rem;
  font-size: 1.8rem;
  cursor: pointer;
  &:hover,
  &:active {
    background-color: #f0b801;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File[]>([]);
  const [image, setImage] = useState<string[]>([]);

  // tweet content
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  // Preview Image file
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      if (file?.length === 4) {
        e.target.value = "";
        alert("파일은 4개까지 업로드 가능합니다.");
        return;
      }

      if (files[0].size > 2 * 1024 * 1024) {
        e.target.value = "";
        alert("업로드 가능한 최대 용량은 2MB입니다.");
        return;
      }

      setFile((prevFiles) => [...prevFiles, files[0]]);
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setImage((pre) => [...pre, reader.result as string]);
      };
    }
  };

  // Delete Image File
  const onFileDelete = (idx: number) => {
    const fileList = file.filter((_, i) => i !== idx);
    const imageList = image.filter((_, i) => i !== idx);
    setFile(fileList);
    setImage(imageList);
  };

  // Submit Tweet and Link with Images
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);

      // tweet upload
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });

      if (file) {
        // Make file path ref
        file.forEach(async (v, idx) => {
          const locationRef = ref(
            storage,
            `tweets/${user.uid}-${user.displayName}/${doc.id}-${idx}`
          );
          // Upload file at storage path
          const result = await uploadBytes(locationRef, v);
          // Get file url
          const url = await getDownloadURL(result.ref);
          await updateDoc(doc, { [`photo${idx}`]: url });
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setTweet("");
      setFile([]);
      setImage([]);
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        value={tweet}
        onChange={onChange}
        placeholder="무슨 일이 일어나고 있나요?"
      />
      <ImageList>
        {image.length !== 0
          ? image.map((v, idx) => (
              <ImageBox>
                <svg
                  onClick={() => onFileDelete(idx)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <img src={v} />
              </ImageBox>
            ))
          : null}
      </ImageList>
      <div style={{ color: "#a7a7a7", marginLeft: "3rem" }}>
        이미지 파일 최대 용량 2MB
      </div>
      <FormTool>
        <AttachFileButton htmlFor="imageFile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#ffc400"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </AttachFileButton>
        <AttachFileInput
          onChange={onFileChange}
          type="file"
          id="imageFile"
          accept="image/*"
        />
        <SubmitBtn
          type="submit"
          value={isLoading ? "게시하는 중" : "게시하기"}
        />
      </FormTool>
    </Form>
  );
}
