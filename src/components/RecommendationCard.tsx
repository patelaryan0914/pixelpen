import { Blog } from "@/app/types";

const RecommendationCard = async ({ data }: { data: Blog }) => {
  console.log(data);

  return (
    <div>
      <div className="mx-auto mt-4 max-w-fit rounded-3xl ring-1 ring-gray-200 sm:mt-4 lg:flex lg:max-w-none">
        <div className="p-8 sm:p-10 lg:flex-auto">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            {data.title.charAt(0).toUpperCase() +
              data.title.slice(1).replaceAll("-", " ")}
          </h3>
          <p className="mt-6 text-base leading-7 text-gray-600">
            {/* {
              data.content.initialContent.filter(
                (val: any) => val.type == "paragraph"
              )[0].content[0].text
            } */}
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
              What’s included
            </h4>
            <div className="h-px flex-auto bg-gray-100" />
          </div>
        </div>
        <div className="-mt-2 p-2 h-full lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded-2xl  bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16"></div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
