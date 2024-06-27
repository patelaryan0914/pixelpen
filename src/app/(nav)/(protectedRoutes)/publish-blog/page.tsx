import dynamic from "next/dynamic";

const BlogEditor = dynamic(() => import("./BlogEditor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const Editor = async () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-slate-500 text-sm mb-5">
        *The Text written in the first block will be considered as Title.
      </h1>
      <BlogEditor />
    </div>
  );
};

export default Editor;
