import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: sessionData } = useSession()

  return (
    <>
      <Head>
        <title>Crhjp</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Battlestation" />
        <meta property="og:description" content="Crhjp annual battlestation event" />
        <meta property="og:image" content="/images/poster.png" />
      </Head>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <img src="/images/icon.png" className="rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-5xl font-bold">C r h j p contest</h1>
            <div>
              {sessionData?.user ?
                <div>
                  <div><a href="/results" className="link link-hover">See results</a></div>
                  <button
                    onClick={() => signOut()}
                    className="btn btn-success">
                    Logout</button>
                </div>
                :
                <>
                  <p className="py-6">
                    It's that time of the year again! For the yearly official unofficial battlestation contest! Login below to vote!
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => signIn('Discord', {
                      callbackUrl: '/voting'
                    })}>Login</button>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
