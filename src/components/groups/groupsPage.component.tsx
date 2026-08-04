import { useSelector } from "react-redux";
import { selectGroupInvites, selectUserGroups } from "@/slices";

const GroupsPage: React.FC = () => {
  const userGroups = [{ group_name: 'Test Group', owner_email: 'zleaman3@gmail.com' }] //useSelector(selectUserGroups);
  const groupInvites = [{ group_name: 'Test Group', invited_by_email: 'zleaman3@gmail.com' }] //useSelector(selectGroupInvites);

  return (
    <>
      <h1>Groups Page</h1>
      <section>
        <h2>Group Invites</h2>
        <ul>
          {groupInvites?.map(({ group_name, invited_by_email }) => (
            <li>
              <div>Group: {group_name}</div>
              <div>Invited By: {invited_by_email}</div>
              <button>Join</button>
              <button>Deny</button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>My Groups</h2>
        <ul>
          {userGroups?.map(({ group_name, owner_email }) => (
            <li>
              <div>Group: {group_name}</div>
              <div>Owner: {owner_email}</div>
              <button>Leave</button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default GroupsPage;