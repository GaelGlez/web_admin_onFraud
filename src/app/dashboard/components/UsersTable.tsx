import { Users } from "@/types/UsersDTO";

export default function UsersTable({ users }: { users: Users[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
          </tr>
        </thead>
<tbody>
  {users.map((u, index) => (
    <tr key={u.id ?? `${u.email}-${index}`}>
      <td>{u.full_name}</td>
      <td>{u.email}</td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}
