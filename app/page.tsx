import Image from "next/image";
import Link from "next/link";
import avatar from "../public/avatar.svg";
export const revalidate = 86400;
function page() {
  return (
    <main className="container max-w-5xl mx-auto space-y-12 p-3 lg:p-6   ">
      {/* text with CTA */}
      <section className="grid grid-cols-2 items-center justify-center   ">
        <div>
          <h1 className="text-3xl md:text-4xl  lg:text-5xl  font-extrabold capitalize max-w-[16ch]   !leading-[3.7rem]">
            Elevate your career with our curated tech job listings.
          </h1>
          <p className="text-lg md:text-xl  lg:text-2xl font-light my-2  w-fit">
            Find your next tech job now
          </p>
          <Link
            href="/signup"
            className="block w-fit bg-primary px-10 py-3 my-6  text-lg md:text-xl text-white  rounded-xl hover:shadow-lg hover:bg-primaryDark transition-all duration-300 ease-in-out "
          >
            Signup
          </Link>
        </div>
        <div className="bg-primary h-full flex items-center rounded-2xl justify-center py-12 p-6 shadow-lg">
          <Image src={avatar} alt="avatar" className="w-5/6   " priority />
        </div>
      </section>
      {/* image */}
      <div className=" border border-primaryDark/25  p-10 rounded-lg shadow-3xl ">
        <h2 className="text-xl lg:text-2xl font-medium mb-2">
          Find Your Next Tech Job
        </h2>
        <p className="  text-lg md:text-xl  lg:text-xl font-light my-3  w-fit">
          Discover the best opportunities in the tech industry with our
          dedicated job portal.
        </p>
        <Link
          href="/jobs"
          className="block w-fit border border-primary text-primary px-6 py-3 mt-4  text-lg md:text-xl   rounded-xl hover:text-white hover:shadow-lg hover:bg-primaryDark transition-all duration-300 ease-in-out "
        >
          Search Jobs
        </Link>
      </div>
    </main>
  );
}

export default page;
