
const Accessdenied = () => {
    return (
        <div className="flex items-center justify-center h-screen ">
            <div className="border border-red-800 shadow-lg rounded-lg p-6 max-w-sm text-center transform transition-transform duration-500 hover:scale-105">
                <h1 className="text-2xl font-bold text-red-600 mb-4 animate-bounce">Access Denied</h1>
                <p className="text-gray-200 mb-6">You do not have permission to view this page.</p>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition duration-200 transform hover:scale-105"
                    onClick={() => window.location.href = '/'}
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default Accessdenied;