import styled from "styled-components";

const Wrapper = styled.div`
  z-index: 10;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: absolute;
  bottom: 0;
  left: 0;
`;
const ModalContainer = styled.div`
  z-index: 11;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  gap: 4rem;
  padding: 5rem 0;
  background-color: white;
  width: 50rem;
`;

const Text = styled.div`
  font-size: 2.4rem;
  font-weight: 400;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  width: 100%;
`;
const Button = styled.div`
  cursor: pointer;
  padding: 1rem 2rem;
  color: #ffc400;
  font-size: 1.6rem;
  font-weight: 300;
  border-radius: 2rem;

  &.cancelBtn {
    background: transparent;
    border: 0.2rem solid #ffc400;
  }
  &.logoutBtn {
    background: #ffc400;
    color: white;
  }
`;

type ModalProps = {
  closeModal?: () => void;
  logOut?: () => void;
};

export default function LogoutModal({ closeModal, logOut }: ModalProps) {
  return (
    <Wrapper>
      <ModalBackground onClick={closeModal} />
      <ModalContainer>
        <Text>로그아웃하시겠습니까?</Text>
        <ButtonsWrapper>
          <Button className="cancelBtn" onClick={closeModal}>
            취소
          </Button>
          <Button className="logoutBtn" onClick={logOut}>
            로그아웃
          </Button>
        </ButtonsWrapper>
      </ModalContainer>
    </Wrapper>
  );
}
