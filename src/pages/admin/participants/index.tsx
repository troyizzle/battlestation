import { type NextPage } from "next";
import Link from "next/link";
import { api } from "../../../utils/api";

const Page: NextPage = () => {
  const participants = api.participant.findAll.useQuery()

  if (!participants.data) {
    return <div>Loading</div>
  }

  return (
    <div className="m-4">
      <div className="flex justify-end mb-2">
        <Link href="/admin/participants/new" className="btn btn-primary">
          New Participant
        </Link>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Usernmame</th>
            <th>discriminator</th>
            <th>Submission counts</th>
          </tr>
        </thead>
        <tbody>
          {participants.data.map((participant) =>
            <tr key={participant.id}>
              <td>{participant.username}</td>
              <td>{participant.discriminator}</td>
              <td>{participant._count.submissions}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Page
