import styled from "styled-components";

export const Wrapper = styled.div`
  margin-top: 20vh;
  height: 100%;
  max-height: 50rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 30rem;
  width: 50vw;
  max-width: 60rem;
  padding: 5rem;
  background-color: white;
  border-radius: 1rem;
`;
export const Title = styled.h1`
  font-size: 4.8rem;
  font-weight: 600;
  color: black;
`;
export const Form = styled.form`
  margin-top: 5rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;
export const Input = styled.input`
  padding: 1rem 2rem;
  border-radius: 5rem;
  border: none;
  width: 100%;
  font-size: 1.6rem;
  &[type="submit"] {
    background: #ffc400;
    color: white;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1.2rem;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 2rem;
  font-size: 1.2rem;
  a {
    color: #ffc400;
  }
`;
