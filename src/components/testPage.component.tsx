// import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreateGroup, fetchJoinGroup, fetchSendGroupInvite, fetchSyncClerkUser, fetchUserGroups, selectUser, selectUserGroups } from "@/slices";
import {
  SignedIn,
  useAuth,
  UserButton,
  useSession
} from "@clerk/clerk-react";
import { useEffect, useRef } from "react";

function TestPage() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { getToken, userId } = useAuth();
  const groupIdRef = useRef(null);
  const emailInputRef = useRef(null);
  const emailConfirmInputRef = useRef(null);
  const nameRef = useRef(null);
  const userGroups = useSelector(selectUserGroups);
  const { session } = useSession();

  useEffect(() => {
    console.log("HEYO")
    const fetchSyncUser = async () => {
      const token = await getToken();
      if (token) {
        dispatch(fetchSyncClerkUser({ token }) as any);
      }
      await setTimeout(() => session?.reload(), 10000);
      window.alert("READY FOR GROUP CREATE")
    }
    fetchSyncUser();
  }, [])

  const fetchTest = async () => {
    const token = await getToken();
    dispatch(fetchUserGroups({ token: token ?? "" }) as any);
  };

  const sendGroupInvite = async (event) => {
    event.preventDefault();

    if (
      groupIdRef.current?.value &&
      groupIdRef.current?.value?.length > 0 &&
      emailConfirmInputRef.current?.value &&
      emailConfirmInputRef.current?.value?.length > 0 &&
      emailConfirmInputRef.current?.value === emailInputRef.current?.value
    ) {
      const token = await getToken();
      dispatch(
        fetchSendGroupInvite({
          token: token ?? "",
          groupId: groupIdRef.current?.value ?? "",
          email: emailInputRef.current?.value ?? "",
        }) as any
      );
    } else {
      // TODO form validation errors
    }
  };
  const createGroupSubmit = async (event) => {
    event.preventDefault();

    if (
      nameRef.current?.value &&
      nameRef.current?.value?.length > 0
    ) {
      const token = await getToken({ skipCache: true });
      dispatch(
        fetchCreateGroup({
          token: token ?? "",
          name: nameRef.current?.value ?? "",
        }) as any
      );
    } else {
      // TODO form validation errors
    }
  };
  const handleJoin = async (groupId: string) => {
    const token = await getToken();
    dispatch(
      fetchJoinGroup({
        token: token ?? "",
        groupId
      }) as any
    );
  }

  const users = userGroups?.userGroups?.map(ug => ({
    ...ug,
    ...userGroups.userInfo.find(u => ug.user_id === u.id)
  }))

  return (
    <header>
      <SignedIn>
        <UserButton />
        <form onSubmit={sendGroupInvite}>
          <p>Send an invite to the group</p>
          <div>
            <label htmlFor="groupId">Group Id*</label>
            <input id="groupId" type="text" ref={groupIdRef} required />
          </div>
          <div>
            <label htmlFor="email">Email*</label>
            <input id="email" type="email" ref={emailInputRef} required />
          </div>
          <div>
            <label htmlFor="email-confirm">Confirm Email*</label>
            <input
              id="email-confirm"
              type="email"
              ref={emailConfirmInputRef}
              required
            />
          </div>
          <button type="submit">Send</button>
        </form>
        <ul>
          {users?.map(u => (<li key={u.id}>
            <span>{u.group_name} - {u.emails?.[0]} - {u.role} - {u.status}{u.id === userId && u.status === 'pending' && <button onClick={() => handleJoin(u.group_id)}>Join</button>}</span>
          </li>))}
        </ul>
        <form onSubmit={createGroupSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" ref={nameRef} required />
          </div>
          <button type="submit">Create Group</button>
        </form>
        <button onClick={fetchTest}>Fetch Users Test</button>
      </SignedIn>
    </header>
  );
}

export default TestPage;
