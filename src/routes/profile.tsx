import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { ITweet } from "../components/Tweet/timeline";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Tweet from "../components/Tweet/tweet";

const Wrapper = styled.div`
  width: 80%;
  border-left: 0.1rem solid #e2e2e2;
  border-right: 0.1rem solid #e2e2e2;

  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: 5rem;

  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 1rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ffc400;
    border-radius: 1rem;
  }
  &::-webkit-scrollbar-track {
    background-color: #fff8e0;
    border-radius: 1rem;
    box-shadow: inset 0 0 0.5rem white;
  }
`;
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 3rem 2rem;
`;
const AvatarUpload = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 13rem;
  height: 13rem;
  background-color: lightgray;
  border-radius: 50%;
  overflow: hidden;
  svg {
    width: 6rem;
    height: 6rem;
    fill: grey;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 2rem;
  font-weight: 600;
`;

const MyTweet = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatarImg, setAvatarImg] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  // Modify user ProfileImg
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (!files || files[0].size > 2 * 1024 * 1024) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);

      // 업로드 된 이미지 파일 url 가져오기
      const url = await getDownloadURL(result.ref);
      setAvatarImg(url); // 미리보기 이미지
      await updateProfile(user, { photoURL: url }); // 유저 프로필 업데이트
    }
  };

  // Current User Timeline
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(tweetQuery);
    const tweetList = snapshot.docs.map((doc) => {
      const data = doc.data();
      const photos = Object.entries(data)
        .filter(([key]) => key.startsWith("photo"))
        .map(([, value]) => value);

      return {
        id: doc.id,
        tweet: data.tweet,
        createdAt: data.createdAt,
        userId: data.userId,
        username: data.username,
        photos: photos,
      };
    });

    setTweets(tweetList);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      <ProfileInfo>
        <AvatarUpload htmlFor="profileImg">
          {avatarImg ? (
            <AvatarImg src={avatarImg} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clip-rule="evenodd"
              />
            </svg>
          )}
        </AvatarUpload>
        <AvatarInput
          onChange={onAvatarChange}
          type="file"
          id="profileImg"
          accept="image/*"
        />
        <Name>{user?.displayName ? user.displayName : "Anonymous"}</Name>
      </ProfileInfo>
      <MyTweet>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </MyTweet>
    </Wrapper>
  );
}
