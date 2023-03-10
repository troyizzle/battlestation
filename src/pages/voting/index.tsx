import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";

function ImageCard({ url, index }: { url: string, index: number }) {
  return (
    <div id={`item${index + 1}`} className="carousel-item w-full">
      <Image alt="submission photo" className="w-full h-96" height={960} src={url} width={1280} />"
    </div>
  )
}

function SubmissionCarousel({ urls }: { urls: string[] }) {
  return (
    <>
      <div className="max-w-4xl">
        <div className="carousel w-full px-1">
          {urls.map((url, index) => <ImageCard key={index} url={url} index={index} />)}
        </div>
      </div>
      <div className="flex justify-center w-full py-2 gap-2">
        {urls.map((_url, index) =>
          <Link key={index} href={`#item${index + 1}`} className="btn btn-xs">
            {index + 1}
          </Link>
        )}
      </div>
    </>
  )
}

type RulesProps = {
  setAcceptedRules: React.Dispatch<React.SetStateAction<boolean>>
}

function Rules({ setAcceptedRules }: RulesProps) {
  const router = useRouter()

  async function handleClick() {
    setAcceptedRules(true)
    const url = {
      path: router.pathname,
      hash: '#item1'
    }
    await router.push(url)
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

function FetchingDiscordData() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="mb-4">Need to fetch some more data, this should be quick if not reach out to a lilhearthie in #tech-support</div>
      <div role="status">
        <svg aria-hidden="true" className="w-28 h-28 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
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
    username: user?.data?.username,
    // @ts-ignore
    discriminator: user?.data?.discriminator as string
  }, {
    enabled: user.data != null && user.data.username != null
  })
  const [votingIndex, setVotingIndex] = useState(0)

  const { mutate } = api.vote.cast.useMutation({
    onSuccess: async () => {
      if (votingIndex + 1 >= participants.data?.length) {
        await router.push("/results")
      } else {
        setVotingIndex(currentVotingIndex => currentVotingIndex += 1)
        await router.push("/voting#item1")
      }
    },
  })

  const { mutate: updateDiscordMutate } = api.user.updateDiscordData.useMutation({
    onSuccess: () => {
      user.refetch()
    }
  })

  async function fetchUsername(accessToken: string) {
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
    if (user == null || user.data == null || user.data.username != null) return;

    if (user.data.accounts.length > 0 && user.data.accounts[0]?.access_token) {
      fetchUsername(user.data.accounts[0].access_token)
    }
  }, [user])


  if (!sessionData?.user) {
    return <div>Login</div>
  }

  if (user.data && !user.data.username) {
    return <FetchingDiscordData />
  }

  if (participants.isLoading || !participants.data) {
    return <div className="animate-pulse">Loading...</div>
  }

  const currentParticipant = participants.data[votingIndex]

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
