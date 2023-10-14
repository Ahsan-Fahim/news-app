import { getAll } from "@/server/news.server";

const callouts = [
  {
    name: "Desk and Office",
    description: "Work from home accessories",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg",
    imageAlt:
      "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
    href: "#",
  },
  {
    name: "Self-Improvement",
    description: "Journals and note-taking",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-02.jpg",
    imageAlt:
      "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
    href: "#",
  },
  {
    name: "Travel",
    description: "Daily commute essentials",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-03.jpg",
    imageAlt: "Collection of four insulated travel bottles on wooden shelf.",
    href: "#",
  },
];

export default async function News() {
  const data = await getAll({ body: "us" });

  return (
    <>
      <div className="flex items-center mt-10 ml-10">
        <div className="flex flex-wrap">
          <div className="flex flex-wrap flex-row basis-1/2 overflow-hidden">
            {data.articles.map((news: any) => {
              return (
                <>
                  <div className="relative h-80 basis-1/3 overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64 mb-10">
                    <img
                      src={news.urlToImage}
                      alt={news.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-10 w-1/2">
                    <h3 className="text-sm text-gray-500">
                      <a href={news.url}>
                        {/* <span className="absolute inset-0" /> */}
                        {news.title}
                      </a>
                    </h3>
                    <p className="mt-5 text-base font-semibold text-gray-900">
                      {news.description}
                    </p>
                  </div>
                </>
              );
            })}
          </div>

          <div className="basis-1/2 overflow-hidden">
            {data.articles.map((news: any, id: number) => {
              return (
                <div key={id} className="flex flex-wrap flex-row">
                  <div className="relative h-60 basis-1/12 overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64 mb-10">
                    <h1 className="text-center text-2xl font-semibold">#{id + 1}</h1>
                  </div>
                  <div className="basis-11/12">
                    <h3 className="text-sm text-gray-500">
                      <a href={news.url}>
                        {/* <span className="absolute inset-0" /> */}
                        {news.title}
                      </a>
                    </h3>
                    <p className="mt-5 text-base font-semibold text-gray-900">
                      {news.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">
            Trending by Categories
          </h2>
          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {callouts.map((callout) => (
              <div key={callout.name} className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <img
                    src={callout.imageSrc}
                    alt={callout.imageAlt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="absolute top-5 left-5">
                  <h3 className="text-sm text-gray-500">
                    <a href={callout.href}>
                      <span className="absolute inset-0" />
                      {callout.name}
                    </a>
                  </h3>
                  <p className="mt-5 text-base font-semibold text-gray-900">
                    {callout.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
