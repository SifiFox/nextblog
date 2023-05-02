import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { sanityClient, urlFor } from "../../sanity";

import { useForm, SubmitHandler } from "react-hook-form";

import { Post } from "../../types";
import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

interface Props {
  post: Post;
}

type Inputs = {
  _id: string;
  name: string;
  email: string;
  comment: string;
};

const Post = ({ post }: Props) => {
  const { data: session } = useSession();
  const [isSubmited, setIsSubmited] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        setIsSubmited(true);
      })
      .catch((err) => {
        setIsSubmited(false);
        console.log(err);
      });
  };

  return (
    <div>
      <Head>
        <title>Detail page</title>
        <link rel="icon" href="/smallLogo.ico" />
      </Head>

      <Header />
      {/* Main image */}
      <img
        className="w-full h-96 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="BG image"
      />

      {/* Articles */}
      <div className="max-w-3xl mx-auto mb-10">
        <article className="w-full mx-auto p-5 bg-secondaryColor/10">
          <h1 className="font-titleFont font-mediumm text-[32px] text-primary border-b-[1px] border-b-cyan-800 mt-10 mb-3">
            {post.title}
          </h1>

          <h2 className="font-bodyFont text-[18px] text-gray-500 mb-2">
            {post.description}
          </h2>

          <div className="flex items-center gap-3">
            <img
              className="rounded-full w-12 h-12 object-cover bg-red-400"
              src={urlFor(post.author.image).url()}
              alt=""
            />
            <p className="font-bodyFont text-base">
              Blog post by{" "}
              <span className="font-bold text-secondaryColor">
                {post.author.name}{" "}
              </span>{" "}
              - Published at {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-10 ">
            <PortableText
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
              projectId={
                process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tpbs2tkj"
              }
              content={post.body}
              serializers={{
                h1: (props: any) => (
                  <h1 className="text-3xl font-bold my-5 font-titleFont">
                    {...props}
                  </h1>
                ),
                h2: (props: any) => (
                  <h2 className="text-2xl font-bold my-5 font-titleFont">
                    {...props}
                  </h2>
                ),

                h3: (props: any) => (
                  <h3 className="text-2xl font-bold my-5 font-titleFont">
                    {...props}
                  </h3>
                ),

                li: ({ children }: any) => (
                  <li className="ml-4 list-disc">{children}</li>
                ),

                link: ({ children, href }: any) => (
                  <a className="text-cyan-500 hover:underline" href={href}>
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        </article>

        <hr className="max-w-lg my-5 mx-auto border[1px] border-secondaryColor" />

        <div>
          <p className="text-xs text-secondaryColor uppercase font-bold">
            Enjoyed this article?
          </p>
          <h3 className="font-titleFont text-3xl font-bold">
            Leave a Comment!
          </h3>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />
          {/* comment form */}

          {isSubmited ? (
            <div>
              <p>Thank for leave comment! Wait for approve it.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-7 flex flex-col gap-6"
            >
              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Name
                </span>
                <input
                  {...register("name", { required: true })}
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                  type="text"
                  placeholder="Enter your name"
                />
              </label>

              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Email
                </span>
                <input
                  {...register("email", { required: true })}
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                  type="email"
                  placeholder="Enter your email"
                />
              </label>

              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Comment
                </span>
                <textarea
                  {...register("comment", { required: true })}
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                  placeholder="Enter your comment"
                  rows={6}
                />
              </label>

              {session && (
                <button
                  className="w-full bg-bgColor text-white text-base font-titleFont font-semiBold tracking-wider uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
                  type="submit"
                >
                  Submit
                </button>
              )}
            </form>
          )}

          {!session && (
            <button
              onClick={() => signIn()}
              className="w-full bg-bgColor text-white text-base font-titleFont font-semiBold tracking-wider uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
              type="submit"
            >
              Sign in to leave comment
            </button>
          )}

          {/* Comments */}
          <div className="w-full flex flex-col p-10 my-10 mx-auto shadow-bgColor shadow-lg space-y-2">
            <h3 className="text-3xl font-titleFont font-semibold">Comments</h3>
            <hr />
            {post.comments.map((comment) => (
              <div key={comment._id}>
                <p>
                  <span className="font-semibold text-secondaryColor">
                    {comment.name}
                  </span>{" "}
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `
    *[_type == "post"]{
        _id,
            slug{
                current
            }
    }
    `;

  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
        _id,
          publishedAt,
          title,
          author -> {
             name,
             image
          },
          "comments": *[_type == "comment" && post._ref == ^._id && approved == true],
          description,
          mainImage,
          slug,
          body
      }
    `;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
