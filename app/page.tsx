"use client";
import { useForm } from "react-hook-form";
import Balancer from "react-wrap-balancer";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { SupabaseContext } from "@/context/SupabaseContext";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type ProjectFormInput = { projectId: string; accessToken: string };

export default function Home() {
  const { setSchemaTypeData } = useContext(SupabaseContext)!;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormInput>();

  const fetchTypescriptType = async (input: ProjectFormInput) => {
    const response = await fetch(`/api/typescript`, {
      method: "POST",
      body: JSON.stringify(input),
    });

    const data = await response.json();
    return data;
  };

  const onSubmit = (input: ProjectFormInput) => {
    if (loading) return;

    toast.promise(
      async () => {
        setLoading(true);
        const { types } = (await fetchTypescriptType(input)) ?? {};
        setSchemaTypeData(types);
        setLoading(false);

        router.push("/editor");
      },
      {
        pending: "Loading the database schema... ⚙️",
        success: "Editor will launch shortly... 👌",
        error: {
          render({ data }) {
            setLoading(false);

            return <span>The connection to the server failed. 🤯</span>;
          },
        },
      }
    );
  };

  return (
    <main data-theme="dark">
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">
              <Balancer>Supabase RLS Editor</Balancer>
            </h1>
            <p className="py-6">
              <Balancer>
                Helps you write Supabase Row Level Security (RLS) in Typescript.
                (* plv8)
              </Balancer>
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
          >
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Project Id</span>
                </label>
                <input
                  type="text"
                  placeholder="project id"
                  className="input input-bordered"
                  {...register("projectId", { required: true })}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Access Token</span>
                </label>
                <input
                  type="text"
                  placeholder="access token"
                  className="input input-bordered"
                  {...register("accessToken", { required: true })}
                />
                <label className="label">
                  <a
                    href="https://app.supabase.com/account/tokens"
                    className="label-text-alt link link-hover"
                    target="_blank"
                  >
                    How to get Access Token?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Open Editor
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
}
