import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
  margin-top: 3rem;
  background: black;
  color: white;
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 3rem;
  font-size: 1.6rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  cursor: pointer;
`;
const Logo = styled.img`
  height: 2.5rem;
`;

export default function GithubButton() {
  const navigation = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigation("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Continue with Github
    </Button>
  );
}
