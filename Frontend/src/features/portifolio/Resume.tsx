import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserPortifolioQuery } from "@/services/portifolioService";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { useParams } from "react-router-dom";

export function Resume() {
    const { firstName } = useParams();
    const { data, isLoading } = useGetUserPortifolioQuery(firstName);
    const userData = data?.data;

    if (isLoading) return <div>Loading...</div>;
    if (!userData) return <div>No user data found</div>;

    // Extract social links
    const socialLinks = userData.socialLinks?.reduce((acc: { [x: string]: any; }, link: { name: string | string[]; link: any; }) => {
        const platform = link.name.includes('telegram') ? 'Telegram' :
            link.name.includes('github') ? 'GitHub' :
                link.name.includes('facebook') ? 'Facebook' : '';
        if (platform) {
            acc[platform] = link.link;
        }
        return acc;
    }, {});

    // Group skills by category
    const skillCategories = userData.SkillCategory?.map((category: { id: any; }) => ({
        ...category,
        skills: userData.Skills?.filter((skill: { skillCategoryId: any; }) => skill.skillCategoryId === category.id)
    }));

    return (
        <div id="resume">
            <Tabs defaultValue="Aboutme" className="max-w-6xl mx-auto mt-10">
                <div className="text-lg text-center">
                    <span className="text-[hsl(var(--accent))] font-mono tracking-wider text-left">ABOUT ME</span>
                </div>

                <TabsList className="flex flex-wrap lg:gap-4 items-center mx-auto mt-5 bg-transparent mb-8 p-0 text-center justify-center">
                    <TabsTrigger
                        value="Aboutme"
                        className="text-[hsl(var(--accent))] data-[state=active]:text-white  px-6 py-3 data-[state=active]:bg-gray-800 data-[state=active]:border-b-4 data-[state=active]:border-[hsl(var(--accent))] w-full sm:w-auto"
                    >
                        About me
                    </TabsTrigger>
                    <TabsTrigger
                        value="skills"
                        className="text-[hsl(var(--accent))] data-[state=active]:text-white  px-6 py-3 data-[state=active]:bg-gray-800 data-[state=active]:border-b-4 data-[state=active]:border-[hsl(var(--accent))] w-full sm:w-auto"
                    >
                        Skills
                    </TabsTrigger>
                    <TabsTrigger
                        value="education"
                        className="text-[hsl(var(--accent))] data-[state=active]:text-white  px-6 py-3 data-[state=active]:bg-gray-800 data-[state=active]:border-b-4 data-[state=active]:border-[hsl(var(--accent))] w-full sm:w-auto"
                    >
                        Education
                    </TabsTrigger>
                    <TabsTrigger
                        value="experience"
                        className="text-[hsl(var(--accent))] data-[state=active]:text-white  px-6 py-3 data-[state=active]:bg-gray-800 data-[state=active]:border-b-4 data-[state=active]:border-[hsl(var(--accent))] w-full sm:w-auto"
                    >
                        Experience
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="Aboutme" className="mt-0 text-left">
                    <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold mb-4">About Me</h3>
                        <p className="text-gray-300 mb-6 text-sm">
                            {userData.userDetails?.aboutMe || "No about me information available."}
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <li className="flex items-start">
                                <span className="text-white/60 mr-2 min-w-[80px]">Name:</span>
                                <span>{userData.userInfo?.firstName} {userData.userInfo?.lastName}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-white/60 mr-2 min-w-[80px]">Phone:</span>
                                <a href={`tel:${userData.phoneNumber}`} className="hover:text-accent transition-colors">
                                    {userData.phoneNumber}
                                </a>
                            </li>
                            <li className="flex items-start">
                                <span className="text-white/60 mr-2 min-w-[80px]">Email:</span>
                                <a href={`mailto:${userData.email}`} className="hover:text-accent transition-colors">
                                    {userData.email}
                                </a>
                            </li>
                            <li className="flex items-start">
                                <span className="text-white/60 mr-2 min-w-[80px]">Experience:</span>
                                <span>{userData.userDetails?.yearsOfExperience} years</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-white/60 mr-2 min-w-[80px]">Title:</span>
                                <span>{userData.userDetails?.title}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-white/60 mr-2 min-w-[80px]">Location:</span>
                                <span>{userData.userInfo?.city}, {userData.userInfo?.country}</span>
                            </li>
                            {socialLinks?.GitHub && (
                                <li className="flex items-start">
                                    <span className="text-white/60 mr-2 min-w-[80px]">GitHub:</span>
                                    <a href={socialLinks.GitHub} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                                        {socialLinks.GitHub.split('/').pop()}
                                    </a>
                                </li>
                            )}
                            {socialLinks?.Telegram && (
                                <li className="flex items-start">
                                    <span className="text-white/60 mr-2 min-w-[80px]">Telegram:</span>
                                    <a href={socialLinks.Telegram} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                                        {socialLinks.Telegram.split('/').pop()}
                                    </a>
                                </li>
                            )}
                            {socialLinks?.Facebook && (
                                <li className="flex items-start">
                                    <span className="text-white/60 mr-2 min-w-[80px]">Facebook:</span>
                                    <a href={socialLinks.Facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                                        {socialLinks.Facebook.split('/').pop()}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="skills" className="mt-0">
                    <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold mb-6">My Skills</h3>

                        {skillCategories?.map((category: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; skills: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; proficiency: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }[]; }) => (
                            <div key={category.id} className="mb-10">
                                <h4 className="text-lg font-semibold mb-4 text-[hsl(var(--accent))]">{category.name}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {category.skills?.map((skill: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; proficiency: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                                        <div key={skill.id} className="bg-gray-800 p-4 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span>{skill.name}</span>
                                                <span className="text-gray-400">{skill.proficiency}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-[hsl(var(--accent))] h-2 rounded-full"
                                                    style={{ width: `${skill.proficiency}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="education" className="mt-0">
                    <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold mb-6">Education</h3>


                        <div className="space-y-8 relative before:absolute before:left-7 grid grid-cols-3 before:h-full before:w-0.5 before:bg-accent/50">
                            {userData.Education?.map((edu: { id: Key | null | undefined; degree: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; fieldOfStudy: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; startDate: string | number | Date; endDate: string | number | Date; institutionName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                                <div key={edu.id} className="relative pl-3 text-left">
                                    <div className="flex-1 bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-accent transition-colors">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                                            <h4 className="text-sm font-semibold text-accent">{edu.degree} in {edu.fieldOfStudy}</h4>
                                            <span className="text-gray-400 text-xs mt-1 md:mt-0">
                                                {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                                            </span>
                                        </div>
                                        <h5 className="text-xs text-gray-400 mb-2">{edu.institutionName}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="experience" className="mt-0">
                    <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold mb-4">Experience</h3>
                        <p className="text-sm">
                            Professional experience details.
                        </p>
                        <div className="mt-7 space-y-8 relative before:absolute before:left-7 grid grid-cols-3 before:h-full before:w-0.5 before:bg-accent/50">
                            {userData.Experience?.map((exp: { id: Key | null | undefined; startDate: string | number | Date; endDate: string | number | Date; position: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; companyName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; area: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; responsibilities: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                                <div key={exp.id} className="relative pl-14 text-left">
                                    <div className="flex-1 bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-accent transition-colors">
                                        <div className="mb-3">
                                            <span className="text-gray-400 text-sm mt-1 md:mt-0">
                                                {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}
                                            </span>
                                            <h4 className="text-sm font-semibold text-accent">{exp.position}</h4>
                                        </div>
                                        <h5 className="text-sm text-gray-400 mb-2">{exp.companyName}, {exp.area}</h5>
                                        <p className="text-gray-300 text-sm">{exp.responsibilities}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}