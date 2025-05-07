import { FaCalendarAlt, FaClock, FaTags, FaArrowRight, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetUserPortifolioQuery } from '@/services/portifolioService';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

type Post = {
    id: number;
    title: string;
    content: string;
    categoryName: string;
    createdAt: string;
    readTime?: string;
    image?: string;
};

function Blog() {
    const { firstName } = useParams();
    const { data, isLoading } = useGetUserPortifolioQuery(firstName);
    const userData = data?.data;

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || 'All Posts');
    const [currentPage, setCurrentPage] = useState(parseInt(queryParams.get('page') ?? '1'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const postsPerPage = 2;
    console.log(setSearchTerm)
    const calculateReadTime = (content: string) => {
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / 200);
        return `${minutes} min read`;
    };

    // Format blog posts from API data
    const formatBlogPosts = (blogs: any[]) => {
        return blogs.map(blog => ({
            id: blog.id,
            title: blog.title,
            content: blog.content,
            categoryName: blog.categoryName,
            createdAt: new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            readTime: calculateReadTime(blog.content),
            image: blog.blogImages && blog.blogImages.length > 0 ? blog.blogImages[0].imageUrl : "" // Dynamic image fetching
        }));
    };

    const blogPosts = userData?.blogs ? formatBlogPosts(userData.blogs) : [];

    // Get unique categories from blog posts
    const categories = ['All Posts', ...new Set(blogPosts.map(post => post.categoryName))];

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Posts' || post.categoryName === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (selectedCategory !== 'All Posts') params.set('category', selectedCategory);
        if (currentPage > 1) params.set('page', currentPage.toString());

        navigate(`?${params.toString()}`, { replace: true });
    }, [searchTerm, selectedCategory, currentPage, navigate]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReadMore = (post: Post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    if (isLoading) return <div className="py-16 text-center">Loading blog posts...</div>;
    if (!userData) return <div className="py-16 text-center">No user data found</div>;

    return (
        <section id='blog' className="py-16 text-white">
            <div className="container mx-auto px-4">
                {/* Blog Header */}
                <div className="text-center mb-16">
                    <h1 className="text-lg text-[hsl(var(--accent))] font-bold mb-4">Blog Posts</h1>
                    <p className="text-sm text-gray-300 max-w-2xl mx-auto">
                        {userData.GeneralDescription?.[0]?.content || "Latest articles and insights"}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Categories Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <FaTags className="mr-2 text-accent text-md" /> Categories
                            </h3>
                            <ul className="space-y-2">
                                {categories.map((category, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => handleCategoryChange(category)}
                                            className={`w-full text-left flex items-center text-sm py-2 px-3 rounded-lg transition-colors ${selectedCategory === category
                                                ? 'bg-[hsl(var(--accent))] text-gray-900 font-medium'
                                                : 'hover:bg-gray-700'
                                                }`}
                                        >
                                            {category}
                                            {category === 'All Posts' && (
                                                <span className="ml-auto bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                                                    {blogPosts.length}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Blog Posts Content */}
                    <div className="lg:w-3/4">
                        {filteredPosts.length === 0 ? (
                            <div className="bg-gray-800/50 p-8 rounded-lg text-center">
                                <h3 className="text-xl font-bold mb-2">No posts found</h3>
                                <p className="text-gray-300">
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {currentPosts.map(post => (
                                        <article
                                            key={post.id}
                                            className="bg-gray-800/50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            <div className="h-48 w-full overflow-hidden rounded-t-lg">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-[70%] object-contain max-h-[380px] mx-auto transition-transform duration-500 hover:scale-105"
                                                />
                                            </div>

                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                                                        {post.categoryName}
                                                    </span>
                                                    <div className="flex items-center text-xs text-gray-400">
                                                        <FaCalendarAlt className="mr-1" />
                                                        <span>{post.createdAt}</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-sm font-bold mb-2 hover:text-accent transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-300 mb-4 text-[10px] line-clamp-3">
                                                    {post.content}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-400 flex items-center">
                                                        <FaClock className="mr-1" />
                                                        {post.readTime}
                                                    </span>
                                                    <button
                                                        onClick={() => handleReadMore(post)}
                                                        className="text-accent text-sm font-medium flex items-center hover:underline"
                                                    >
                                                        Read More <FaArrowRight className="ml-1" />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-12">
                                        <nav className="text-[10px] flex items-center space-x-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 border border-gray-700 rounded-lg transition-colors ${currentPage === 1
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:bg-gray-800/50'
                                                    }`}
                                            >
                                                Previous
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-4 py-2 rounded-lg ${currentPage === page
                                                        ? 'bg-[hsl(var(--accent))] text-gray-900 font-medium'
                                                        : 'border border-gray-700 hover:bg-gray-800/50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 border border-gray-700 rounded-lg transition-colors ${currentPage === totalPages
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:bg-gray-800/50'
                                                    }`}
                                            >
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isModalOpen && selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 overflow-y-auto"
                    >
                        <div className="flex items-center justify-center  px-4">
                            <div className="fixed inset-0 bg-black opacity-90" onClick={closeModal}></div>

                            <div className="relative z-30 bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg md:max-w-lg sm:max-w-lg mx-auto my-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full mb-2 inline-block">
                                            {selectedPost.categoryName}
                                        </span>
                                        <h3 className="text-2xl font-bold mb-2">{selectedPost.title}</h3>
                                        <div className="flex items-center text-sm text-gray-400 mb-4">
                                            <FaCalendarAlt className="mr-1" />
                                            <span className="mr-4">{selectedPost.createdAt}</span>
                                            <FaClock className="mr-1" />
                                            <span>{selectedPost.readTime}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-white p-2"
                                    >
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mt-4">
                                    {selectedPost.image && (
                                        <div className="bg-gray-800 rounded-xl mb-6 shadow p-2 flex justify-center items-center max-h-[400px]">
                                            <img
                                                src={selectedPost.image}
                                                alt={selectedPost.title}
                                                className="w-[70%] object-contain max-h-[380px]"
                                            />
                                        </div>



                                    )}
                                    <div className="prose prose-invert max-w-none text-gray-300">
                                        {selectedPost.content}
                                    </div>
                                </div>

                                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border bg-gray-300 shadow-sm px-4 py-2 bg-accent text-gray-900 font-medium hover:bg-accent/90 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

export default Blog;