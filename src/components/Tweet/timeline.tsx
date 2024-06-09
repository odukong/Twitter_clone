import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";
export interface ITweet {
  id: string;
  createdAt: number;
  tweet: string;
  userId: string;
  username: string;
  photos?: string[];
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweet = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(30)
      );

      // 실시간 타임라인 반영
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweetsList = snapshot.docs.map((doc) => {
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

        setTweets(tweetsList);
      });
    };
    fetchTweet();

    // 다른 페이지로 이동하면 snapshot 구독 취소
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
