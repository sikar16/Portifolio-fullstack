import { useGetUserPortifolioQuery } from "@/services/portifolioService";
import { useParams } from "react-router-dom";

export const Social = () => {
    const { firstName } = useParams(); // Get firstName from URL params
    const { data } = useGetUserPortifolioQuery(firstName); // Pass firstName as an argument
    const userData = data?.data;

    return (
        <div className="flex gap-4">
            <a
                href={userData?.userDetails.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[hsl(var(--accent))] rounded-lg text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-white transition-all duration-300 px-4 py-2"
            >
                Download CV
            </a>
            {userData?.socialLinks.map((link: { id: string; link: string; name: string }) => (
                <a
                    key={link.id} // Use unique key from the link object
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-[hsl(var(--accent))] rounded-full flex justify-center items-center text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-white transition-all duration-300"
                >
                    <img src={link.name} alt="" className="w-full h-full object-contain" />
                </a>
            ))}

        </div>
    );
};