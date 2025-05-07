import { Social } from '@/components/social';
import { useGetUserPortifolioQuery } from '@/services/portifolioService';
import { useParams } from 'react-router-dom'; // Import useParams

export default function Home() {
    const { firstName } = useParams(); // Get firstName from URL params
    const { data, isLoading } = useGetUserPortifolioQuery(firstName); // Pass firstName as an argument
    const userData = data?.data;

    // console.log(userData?.GeneralDescription[0].content)

    if (isLoading) return <div>Loading...</div>;

    return (
        <section id='home' className="min-h-screen bg-[hsl(var(--primary))] text-white py-20 px-6 flex flex-col ">
            <div className="max-w-6xl mx-auto w-full">
                <div className="text-center  grid md:grid-cols-2 gap-16 items-center">
                    <div className="text-center  space-y-8 order-2 md:order-1 md:text-left">
                        <span className="text-accent tracking-wider text-sm">Hello I'm</span>
                        <h1 className="text-xl text-[hsl(var(--accent))] md:text-4xl leading-tight">
                            {userData?.userInfo.firstName} {userData?.userInfo.lastName}
                            <span className="text-accent animate-pulse">.</span>
                        </h1>
                        <p className="hidden md:block text-sm md:text-sm text-gray-300 leading-relaxed">
                            {userData?.GeneralDescription?.[0]?.content || " "}
                        </p>
                        <div className="flex items-center mx-auto text-ceneter space-x-4 pt-2">
                            {/* <Button className="border border-[hsl(var(--accent))] hover:bg-accent hover:text-accent-foreground rounded-lg text-white px-8 py-4 text-sm transition-all hover:scale-105">
                                DOWNLOAD CV
                            </Button> */}
                            <Social />
                        </div>
                    </div>
                    <div className="order-1 md:order-2 flex justify-center md:justify-end">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 group">
                            <div className="absolute inset-0 bg-accent/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                            <img
                                src={userData?.userDetails.heroImage}
                                alt="Profile illustration"
                                className="relative w-full h-full object-contain z-10 animate-float"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-3 gap-2 md:gap-6 mt-20 w-full">
                    <div className=" p-3 border-l-4 border-[hsl(var(--accent))] hover:bg-gray-800/70 transition-all group">
                        <h3 className="text-2xl font-bold mb-2 text-[hsl(var(--accent))] group-hover:text-white transition-colors">{userData?.userDetails.yearsOfExperience}</h3>
                        <p className="text-gray-400 group-hover:text-gray-200 transition-colors">Years of experience</p>
                    </div>

                    <div className=" p-3 border-l-4 border-[hsl(var(--accent))] hover:bg-gray-800/70 transition-all group">
                        <h3 className="text-2xl font-bold mb-2 text-[hsl(var(--accent))] group-hover:text-white transition-colors">
                            {userData?._count.projects}
                        </h3>
                        <p className="text-gray-400 group-hover:text-gray-200 transition-colors">Projects completed</p>
                    </div>

                    <div className=" p-3 border-l-4 border-[hsl(var(--accent))] hover:bg-gray-800/70 transition-all group">
                        <h3 className="text-2xl font-bold mb-2 text-[hsl(var(--accent))] group-hover:text-white transition-colors">
                            {userData?._count.Skills}
                        </h3>
                        <p className="text-gray-400 group-hover:text-gray-200 transition-colors">Skills mastered</p>
                    </div>
                </div>
            </div>
        </section>
    );
}