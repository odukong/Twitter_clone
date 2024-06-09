import styled from "styled-components";
import PostTweetForm from "../components/Post/post-tweet-form";

const Wrapper = styled.div`
  width: 80%;
  border-left: 0.1rem solid #e2e2e2;
  border-right: 0.1rem solid #e2e2e2;
`;
export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
    </Wrapper>
  );
}
