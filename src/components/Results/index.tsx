import Image from "next/image";
import { api } from "../../utils/api";

type dataMapped = {
  username: string,
  image: string | null,
  totalRating: number,
  votes: {
    username: string,
    rating: number | null,
    image: string | null
  }[]
}

function VotingTable({ votes }: { votes: dataMapped["votes"] }) {
  const sortedVotes = votes.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Username</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {sortedVotes.map((vote, indx) =>
          <tr key={indx}>
            <td>
              <div className="flex items-center">
                {vote.username}
                {vote.image && <Image width={16} height={16} src={vote.image} className="mt-1 rounded-full" alt="avatar" />}
              </div>
            </td>
            <td>{vote.rating}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

function ResultRow({ username, image, totalRating, votes }: dataMapped) {
  return (
    <>
      <div className="collapse w-full">
        <input type="checkbox" />
        <div className="collapse-title w-full text-xs md:text-xl font-medium">
          <div className="flex items-center justify-between space-x-3">
            <div className="flex items-center max-w-[1em]">
              <div className="font-bold text-lg">{username}</div>
              <div className="avatar">
                <div className="mask mask-squircle w-8 h-8 md:w-12 md:h-12">
                  {image && <Image src={image} alt="avatar" width={32} height={32} />}
                </div>
              </div>
            </div>
            {totalRating && (
              <div className="flex flex-row items-center">
                SCORE! {totalRating.toString()}
              </div>
            )}
            <button className="btn btn-ghost btn-xs ml-2">vote details</button>
          </div>
        </div>
        <div className="collapse-content">
          <div className="w-full"><VotingTable votes={votes} /></div>
        </div>
      </div>
    </>
  )
}

export default function Results() {
  const participants = api.participant.getAllVoteData.useQuery()

  if (!participants.data) {
    return <div>Loading</div>
  }

  const dataArray: dataMapped[] = []

  participants.data.forEach((participant) => {
    const obj = dataArray.find(el => el.username == participant.username)
    const { rating, image, votingusername, username, votinguserimage } = participant
    const data = {
      username: votingusername,
      rating: rating,
      image: votinguserimage
    }

    if (obj) {
      obj.totalRating += rating ?? 0
      obj.votes.push(data)
    } else {
      dataArray.push({
        username: username,
        image: image,
        totalRating: rating ?? 0,
        votes: [data]
      })
    }
  })

  const sortedData = dataArray.sort((a, b) => b.totalRating - a.totalRating)

  return (
    <div className="mx-3 mt-6">
      <h1 className="text-5xl font-bold text-white text-center">Leaderboard</h1>

      <div id="leaderboard" className="w-full flex flex-col space-y-3">
        {sortedData.map((data, indx) =>
          <ResultRow key={indx} {...data} />
        )}
      </div>
    </div>
  )
}
