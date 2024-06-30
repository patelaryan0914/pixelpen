import { Blog } from "@/app/types";
import Image from "next/image";

const RecommendationCard = async ({ data }: { data: Blog }) => {
  return (
    <div className="h-full grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
      <div className="mx-auto mt-10 w-4/5 sm:col-span-1 rounded-3xl ring-1 ring-gray-200 md:col-span-2 grid grid-cols-1 sm:grid-cols-3">
        <div className="p-8 sm:p-10 lg:flex-auto col-span-2">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            {data.title.charAt(0).toUpperCase() +
              data.title.slice(1).replaceAll("-", " ")}
          </h3>
          <p className="mt-6 text-base leading-7 text-gray-600">
            {
              data.content.filter((val: any) => val.type == "paragraph")[0]
                .content[0].text
            }
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
              What’s included
            </h4>
            <div className="h-px flex-auto bg-gray-100" />
          </div>
        </div>
        <div className="-mt-2 p-2 h-full lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 min-h-fit">
          <div className="h-full rounded-2xl py-10 text-center lg:flex lg:flex-col lg:justify-center">
            <Image
              src={
                data.content.filter((val: any) => val.type == "image")[0]?.props
                  .url
              }
              width={500}
              height={500}
              alt="Image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
