import { NextPage } from "next";
import { api } from "../../utils/api";

type dataMapped = {
  username: string,
  image: string | null,
  totalRating: number,
  votes: {
    username: string,
    rating: number
  }[]
}

function VotingTable({ votes }: { votes: dataMapped["votes"] }) {
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Userame</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {votes.map((vote, indx) =>
          <tr key={indx}>
            <td>{vote.username}</td>
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
            <div className="flex items-center">
              <div className="font-bold">{username}</div>
              <div className="avatar ml-2">
                <div className="mask mask-squircle w-8 h-8 md:w-12 md:h-12">
                  {image &&
                    <img src={image} alt="Avatar Tailwind CSS Component" />
                  }
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center">
              SCORE! {totalRating.toString()}
            </div>
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
    const { rating, image, votingusername, username } = participant
    const data = {
      username: votingusername,
      rating: rating
    }

    if (obj) {
      obj.totalRating += rating
      obj.votes.push(data)
    } else {
      dataArray.push({
        username: username,
        image: image,
        totalRating: rating,
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
