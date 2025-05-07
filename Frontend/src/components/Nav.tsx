import { Button } from './ui/button'
import { useLocation } from 'react-router-dom'

function Nav() {
    const location = useLocation()
    const currentPath = location.pathname

    // Map of paths to their corresponding menu items
    const menuItems = [
        { name: 'Home', path: '' },
        { name: 'Services', path: '#service' },
        { name: 'Resume', path: '#resume' },
        { name: 'Work', path: '#project' },
        { name: 'Testimony', path: '#testimony' },
        { name: 'Blog', path: '#blog' },
        { name: 'Contact', path: '#contact' }
    ]

    return (
        <nav className="fixed w-full z-20 top-0 left-0  backdrop-blur-sm">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-6">
                <div className="flex items-center">
                    <span className="text-3xl font-bold text-white/60 hover:text-white transition-colors">Name</span>
                    <span className="text-3xl font-bold text-[hsl(var(--accent))] ">.</span>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    <ul className="flex space-x-8">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <a
                                    href={item.path}
                                    className={`relative font-medium transition-colors ${currentPath === item.path
                                        ? 'text-white underline decoration-[hsl(var(--accent))]  decoration-2 underline-offset-8'
                                        : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <Button className="ml-6 bg-[hsl(var(--accent))]  hover:bg-accent/90 text-white font-bold px-6 py-3 rounded-md transition-colors">
                        HIRE ME
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Nav