import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Results from "../../components/Results";
import { api } from "../../utils/api";

function ImageCard({ url, index }: { url: string, index: number }) {
  return (
    <div id={`item${index + 1}`} className="carousel-item w-full">
      <img src={url} className="w-full h-96 object-fit rounded-sm" />
    </div>
  )
}

function SubmissionCarousel({ urls }: { urls: string[] }) {
  return (
    <>
      <div className="carousel w-full px-1">
        {urls.map((url, index) => <ImageCard key={index} url={url} index={index} />)}
      </div>
      <div className="flex justify-center w-full py-2 gap-2">
        {urls.map((_url, index) => <a key={index} href={`#item${index + 1}`} className="btn btn-xs">{index + 1}</a>)}
      </div>
    </>
  )
}

type RulesProps = {
  setAcceptedRules: React.Dispatch<React.SetStateAction<boolean>>
}

function Rules({ setAcceptedRules }: RulesProps) {
  const router = useRouter()

  function handleClick() {
    setAcceptedRules(true)
    const url = {
      path: router.pathname,
      hash: '#item1'
    }
    router.push(url)
  }
  return (
    <div className="hero">
      <div className="hero-content min-h-screen text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Rules</h1>
          <p className="py-6">Vote for your favorite battlestation! you will not be able to vote for yourself and please vote fair!</p>
          <button
            onClick={handleClick}
            className="btn btn-success">Start voting!</button>
        </div>
      </div>
    </div>
  )
}

type VotingFormProps = {
  participant: any
  mutate: any
}

function VotingForm({ participant, mutate }: VotingFormProps) {
  const [rating, setRating] = useState(3)
  const stars = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-line-400",
    "bg-green-400"
  ]

  function handleClick() {
    mutate({ participantId: participant.id, rating: rating })
  }

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="w-75 min-h-screen flex flex-col items-center justify-center">
        <SubmissionCarousel urls={participant.submissions.map((s: any) => s.url)} />
        <p>Use the stars to vote this battlestation 1 - 5</p>
        <div className="rating gap-1 mt-1">
          {stars.map((star, index) => <input key={index} onChange={(e) => setRating(+e.target.value)} checked={(index + 1) == rating} type="radio" name="rating-3" value={index + 1} className={`mask mask-heart ${star}`} />
          )}
        </div>
        <button onClick={handleClick} className="btn btn-primary btn-wide mt-2">Submit</button>
      </div>
    </div>
  )
}


const Page: NextPage = () => {
  const { data: sessionData } = useSession()
  const router = useRouter()
  const user = api.user.findUser.useQuery({ userId: sessionData?.user?.id as string }, {
    enabled: sessionData != null && sessionData?.user?.id != null
  })
  const [acceptedRules, setAcceptedRules] = useState(false)
  const participants = api.participant.findForVoting.useQuery({
      // @ts-ignore
    username: user.data.username,
    // @ts-ignore
    discriminator: user.data.discriminator as string
  }, {
    enabled: user.data != null && user.data.username != null
  })
  const [votingIndex, setVotingIndex] = useState(0)

  const { mutate } = api.vote.cast.useMutation({
    onSuccess: () => {
      setVotingIndex(currentVotingIndex => currentVotingIndex += 1)
      router.push("/voting#item1")
    }
  })

  const { mutate: updateDiscordMutate } = api.user.updateDiscordData.useMutation({
    onSuccess: () => {
      user.refetch()
    }
  })

  async function fetchUsername(accessToken: string) {
    console.log("fetchinmg username for access token", accessToken)
    const resp = await fetch("https://discord.com/api/users/@me", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })

    const data = await resp.json()
    updateDiscordMutate({
      username: data.username,
      discriminator: data.discriminator
    })
  }

  useEffect(() => {
    if (!user.data) return;
    if (user.data.username) return;

    if (user.data.accounts.length == 0 && user.data.accounts[0]?.access_token) {
      fetchUsername(user.data.accounts[0].access_token)
    }
  }, [user])


  if (!sessionData?.user) {
    return <div>Login</div>
  }

  if (user.data && !user.data.username) {
    return <div>need to fetch the data!</div>
  }

  if (participants.isLoading || !participants.data) {
    return <div className="animate-pulse">Loading...</div>
  }

  const currentParticipant = participants.data[votingIndex]

  if (currentParticipant == undefined) {
    router.push("/results")
    return <Results />
  }

  return (
    <div>
      {acceptedRules ?
        <VotingForm participant={currentParticipant} mutate={mutate} />
        :
        <Rules setAcceptedRules={setAcceptedRules} />
      }
    </div>
  )
}

export default Page;
