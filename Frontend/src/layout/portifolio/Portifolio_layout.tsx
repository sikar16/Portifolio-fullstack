
import Nav from "@/components/Nav"
import Blog from "@/features/portifolio/Blog"
import Contact from "@/features/portifolio/Conatct"
import Home from "@/features/portifolio/Home"
import ProjectPage from "@/features/portifolio/Project"
import { Resume } from "@/features/portifolio/Resume"
import Services from "@/features/portifolio/Services"
import Testimony from "@/features/portifolio/Testimony"

function Portifolio_layout() {

    return (
        <div>
            <Nav />
            <Home />
            <Services />
            <Resume />
            <ProjectPage />
            <Testimony />
            <Blog />
            <Contact />
        </div>
    )
}

export default Portifolio_layout