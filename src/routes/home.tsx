import styled from "styled-components";
import PostTweetForm from "../components/Post/post-tweet-form";
import Timeline from "../components/Tweet/timeline";

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
export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
