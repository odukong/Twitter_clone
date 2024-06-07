import styled from "styled-components";
import { PacmanLoader } from "react-spinners";
const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function LoadingScreen() {
  return (
    <Wrapper>
      <PacmanLoader color="white" />
    </Wrapper>
  );
}
