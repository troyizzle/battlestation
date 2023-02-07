import { NextPage } from "next"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateParticipantInput, createParticipantSchema } from "../../../schema/participant.schema"
import { api } from "../../../utils/api"
import { useToast } from "../../../context/ToastContex"
import { useRouter } from "next/router"
import { CreateSubmissionSchema } from "../../../schema/submission.schema"

const Page: NextPage = () => {
  const { addToasts } = useToast()
  const router = useRouter()

  const initialSubmissionValue: CreateSubmissionSchema = {
    url: ""
  }

  const initialiValues: CreateParticipantInput = {
    username: "",
    discriminator: "",
    submissions: [initialSubmissionValue]
  }

  const { control, register, handleSubmit } = useForm<CreateParticipantInput>({
    defaultValues: initialiValues,
    resolver: zodResolver(createParticipantSchema)
  })

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "submissions"
  })

  const { mutate } = api.participant.create.useMutation({
    onSuccess: () => {
      router.push("/admin/participants/")
      addToasts("Participant added")
    },
    onError: (err) => {
      console.log(err)
    }
  })

  // TODO: How to write this as a function?
  const onSubmit: SubmitHandler<CreateParticipantInput> = (data) => mutate(data);

  return (
    <div>
      <h1 className="text-center hero-content text-3xl font-bold text-white">Add a new participant</h1>
      <div className="flex flex-col items-center justify-center mx-auto">
        <div className="bg-gray-500 p-4 max-w-3xl w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label
                htmlFor="discrimiantor"
                className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                {...register("username")}
                type="text" placeholder="Enter username.." className="input input-bordered w-full" />
            </div>
            <div className="form-control w-full">
              <label htmlFor="discrimiantor"
                className="label">
                <span className="label-text">Discrimiantor</span>
              </label>
              <input
                {...register("discriminator")}
                type="text" placeholder="Enter discrimiantor.." className="input input-bordered w-full" />
            </div>
            <div className="flex justify-end mt-2">
              <button
              className="flex items-center rounded-full bg-blue-500 py-2 px-3 text-white font-bold hover:bg-blue-600"
              type="button" onClick={() => append(initialSubmissionValue)}>+</button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="form-control w-full">
                <label className="label">
                  <span className="label-text">Enter image url</span>
                </label>
                <input
                  {...register(`submissions.${index}.url`)}
                  type="text" placeholder="Enter url.." className="input input-bordered w-full" />
                <button onClick={() => remove(index)}>remove</button>
              </div>
            ))}
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary mt-1">Submit</button>
            </div>
          </form>
        </div>
      </div >
    </div >
  )
}

export default Page
