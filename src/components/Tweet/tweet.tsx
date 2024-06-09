import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem 5rem;
  gap: 1rem;

  border-bottom: 0.1rem solid #e2e2e2;
  &:first-child {
    border-top: 0.1rem solid #e2e2e2;
  }
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

const UserName = styled.div`
  font-size: 2rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;
const Text = styled.div`
  font-size: 1.6rem;
`;
const Photos = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const PhotoBox = styled.div`
  width: 15rem;
  height: 10rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const DeleteBtn = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: none;
  font-size: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;

export default function Tweet({ userId, username, tweet, photos, id }: ITweet) {
  const user = auth.currentUser;
  const onDelete = async () => {
    const deleteOk = confirm("정말 이 트윗을 삭제하겠습니까?");
    if (!deleteOk || user?.uid !== userId) return;
    try {
      // delete tweet
      await deleteDoc(doc(db, "tweets", id));
      // delete tweet image
      if (photos) {
        photos.forEach(async (_, idx) => {
          const photoRef = ref(
            storage,
            `tweets/${user.uid}-${user.displayName}/${id}-${idx}`
          );
          await deleteObject(photoRef);
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  return (
    <Wrapper>
      <Column>
        <UserName>
          <span>{username}</span>
          {user?.uid === userId ? (
            <DeleteBtn onClick={onDelete}>삭제</DeleteBtn>
          ) : null}
        </UserName>
        <Text>{tweet}</Text>
      </Column>
      <Column>
        <Photos>
          {photos
            ? photos.map((photo) => (
                <PhotoBox>
                  <img src={`${photo}`} />
                </PhotoBox>
              ))
            : null}
        </Photos>
      </Column>
    </Wrapper>
  );
}
