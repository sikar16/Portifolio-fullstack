import { FaCalendarAlt, FaTags, FaExternalLinkAlt, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetUserPortifolioQuery } from '@/services/portifolioService';
import { useParams } from 'react-router-dom';
type ProjectImage = {
    image: string;
};
type Project = {
    projectImage: ProjectImage[];
    id: number;
    name: string;
    description: string;
    demoLink: string;
    technology: string;
    projectCategoryId: number;
    categoryName?: string;
    createdAt?: string;
};

const Projects = () => {
    const { firstName } = useParams();
    const { data, isLoading } = useGetUserPortifolioQuery(firstName);
    const userData = data?.data;

    const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    if (isLoading) return <div className="py-16 text-center">Loading projects...</div>;
    if (!userData) return <div className="py-16 text-center">No user data found</div>;

    // Format projects with category names
    const formatProjects = () => {
        return userData.projects.map((project: Project) => {
            const category = userData.ProjectCategory.find((cat: Project) => cat.id === project.projectCategoryId);
            return {
                ...project,
                categoryName: category?.name || 'Uncategorized',
                createdAt: project.createdAt || new Date().toISOString()
            };
        });
    };

    const projects: Project[] = formatProjects();
    const categories: string[] = ['All Projects', ...userData.ProjectCategory.map((cat: Project) => cat.name)];

    const filteredProjects = selectedCategory === 'All Projects'
        ? projects
        : projects.filter(project => project.categoryName === selectedCategory);

    const featuredProject = filteredProjects[0];
    const otherProjects = filteredProjects.slice(1);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    // Format date from ISO string
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    return (
        <section id='project' className="py-16 text-white">
            <div className="container mx-auto px-4 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-2xl md:text-3xl font-semibold text-[hsl(var(--accent))] mb-3">PORTFOLIO</h1>
                    <p className="text-sm text-gray-300 max-w-2xl mx-auto">
                        My professional projects and work samples
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Sidebar */}
                    <aside className="lg:w-1/4">
                        <div className="bg-gray-800/60 p-6 rounded-xl sticky top-10">
                            <h3 className="text-lg font-semibold mb-5 flex items-center">
                                <FaTags className="mr-2" /> Project Types
                            </h3>
                            <ul className="space-y-2">
                                {categories.map((category) => (
                                    <li key={category}>
                                        <button
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full text-left flex items-center justify-between text-sm px-4 py-2 rounded-lg transition-all duration-200 ${selectedCategory === category
                                                ? 'bg-[hsl(var(--accent))] text-black font-semibold'
                                                : 'bg-gray-700/50 hover:bg-gray-700 text-white'
                                                }`}
                                        >
                                            {category}
                                            {category === 'All Projects' && (
                                                <span className="bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                                                    {projects.length}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <main className="w-full">
                        <div className="flex flex-col lg:flex-row justify-around gap-3">
                            {/* Featured Project */}
                            {featuredProject && (
                                <section className="lg:w-[65%] w-full">
                                    <h3 className="text-xl font-semibold mb-4">Featured Project</h3>
                                    <div className="bg-gray-800/60 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
                                        <div className="relative aspect-video flex items-center justify-center bg-gray-700">
                                            {featuredProject.projectImage?.[0]?.image ? (
                                                <img
                                                    src={featuredProject.projectImage[0].image}
                                                    alt={featuredProject.name}
                                                    className="object-contain w-[70%] max-h-[380px]"
                                                />
                                            ) : (
                                                <span className="text-gray-400">No Image Available</span>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex flex-wrap items-center justify-between mb-4 text-xs text-gray-400">
                                                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs">
                                                    {featuredProject.categoryName}
                                                </span>
                                                <div className="flex items-center">
                                                    <FaCalendarAlt className="mr-1" />
                                                    <span>{formatDate(featuredProject.createdAt || 'default-date')}</span>
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-semibold mb-2">{featuredProject.name}</h4>
                                            <p className="text-gray-300 text-sm mb-4">{featuredProject.description}</p>
                                            <div className="flex items-center justify-between text-sm font-medium">
                                                <a
                                                    href={featuredProject.demoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[hsl(var(--accent))] hover:underline flex items-center"
                                                >
                                                    View Demo <FaExternalLinkAlt className="ml-2" />
                                                </a>
                                                <button
                                                    onClick={() => handleProjectClick(featuredProject)}
                                                    className="text-gray-300 hover:text-[hsl(var(--accent))] hover:underline flex items-center"
                                                >
                                                    View Detail <FaExternalLinkAlt className="ml-2" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Other Projects */}
                            {otherProjects.length > 0 && (
                                <section className="lg:w-[35%] w-full">
                                    <div className="mb-6 flex justify-between items-center">
                                        <h3 className="text-sm font-bold">Other Projects</h3>

                                    </div>

                                    <div className="relative">
                                        <div
                                            ref={scrollRef}
                                            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
                                            style={{ scrollbarWidth: 'none' }}
                                        >
                                            {otherProjects.map((project) => (
                                                <motion.article
                                                    key={project.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex-shrink-0 w-[240px] bg-gray-800/60 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
                                                >
                                                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                                                        {project.projectImage?.[0]?.image ? (
                                                            <img
                                                                src={project.projectImage[0].image}
                                                                alt={project.name}
                                                                className="object-contain w-[70%] max-h-[380px]"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400">No Image</span>
                                                        )}
                                                    </div>
                                                    <div className="p-4">
                                                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                                            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs">
                                                                {project.categoryName}
                                                            </span>
                                                            <div className="flex items-center">
                                                                <FaCalendarAlt className="mr-1" />
                                                                <span>{formatDate(project.createdAt || 'default-date')}</span>
                                                            </div>
                                                        </div>
                                                        <h4 className="text-sm font-semibold mb-1">{project.name}</h4>
                                                        <p className="text-gray-300 text-xs mb-4 line-clamp-2">{project.description}</p>
                                                        <div className="flex items-center justify-around text-[6px]">
                                                            <a
                                                                href={project.demoLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[hsl(var(--accent))] hover:underline flex items-center text-xs"
                                                            >
                                                                View Demo <FaExternalLinkAlt className="ml-1" />
                                                            </a>
                                                            <button
                                                                onClick={() => handleProjectClick(project)}
                                                                className="flex justify-end hover:text-[hsl(var(--accent))] text-gray-300 flex items-center hover:underline text-xs"
                                                            >
                                                                View Detail <FaExternalLinkAlt className="ml-1" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                </motion.article>

                                            ))}

                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={scrollLeft}
                                                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                                            >
                                                <FaArrowLeft />
                                            </button>
                                            <button
                                                onClick={scrollRight}
                                                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                                            >
                                                <FaArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </main>

                </div>
            </div>


            <AnimatePresence>
                {isModalOpen && selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 overflow-y-auto"
                    >
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <div className="fixed inset-0 bg-black opacity-90" onClick={closeModal}></div>

                            <div className="relative z-50 bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full mt-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                                            {selectedProject.categoryName}
                                        </span>
                                        <h3 className="text-2xl font-bold mt-2">{selectedProject.name}</h3>
                                        <div className="flex flex-wrap text-sm text-gray-400 gap-4 mt-2">
                                            <span className="flex items-center">
                                                <FaCalendarAlt className="mr-1" />
                                                <span className="mr-3">{formatDate(featuredProject.createdAt || 'default-date')}</span>                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-white p-2">
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="aspect-w-16 aspect-h-9 mb-6">
                                    <div className="w-full h-[300px] bg-gray-700 flex items-center justify-center">
                                        {selectedProject.projectImage && selectedProject.projectImage.length > 0 ? (
                                            <img
                                                src={selectedProject.projectImage[0].image}
                                                alt={selectedProject.name}
                                                className="w-[70%] object-contain max-h-[380px]"
                                            />
                                        ) : (
                                            <span className="text-gray-400">No Image Available</span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2">
                                        <h4 className="font-bold text-lg mb-3">Project Overview</h4>
                                        <p className="text-gray-300 mb-6">{selectedProject.description}</p>
                                        <a
                                            href={selectedProject.demoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-[hsl(var(--accent))] hover:underline"
                                        >
                                            View Live Demo <FaExternalLinkAlt className="ml-2" />
                                        </a>
                                    </div>

                                    <div className="md:col-span-1">
                                        <div className="bg-gray-700/50 p-4 rounded-lg">
                                            <h4 className="font-bold mb-3">Technologies Used</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.technology.split(',').map((tech) => (
                                                    <span
                                                        key={tech.trim()}
                                                        className="bg-gray-600 text-white text-xs px-3 py-1 rounded-full"
                                                    >
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Projects;