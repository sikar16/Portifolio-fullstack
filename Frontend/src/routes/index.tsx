import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Portifolio_layout from "@/layout/portifolio/Portifolio_layout";
import Dashboard_layout_user from "@/layout/dashboard/Dashboard_layout";
import Dashboard_layout_serviceProvider from "@/layout/serviceProviderdashboard/Dashboard_layout";
import Profile from "@/features/dashboard/Profile";
import Service from "@/features/dashboard/Service";
import Skill from "@/features/dashboard/Skill";
import Education from "@/features/dashboard/Education";
import Experience from "@/features/dashboard/Expriance";
import Testimonial from "@/features/dashboard/Testimony";
import Blog from "@/features/dashboard/Blog";
import Project from "@/features/dashboard/Project";
import Login from "@/components/Login";
import Accessdenied from "@/components/Access_denied";
import Users from "@/features/serviceProvider/Users";
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>

      <Route
        path="/"
        element={<Login />}
      />
      <Route
        path="/portifolio/:firstName"
        element={<Portifolio_layout />}
      />
      <Route
        path="/denied"
        element={<Accessdenied />}
      />
      <Route
        path="/dashboard/profile"
        element={<Profile />}
      />

      <Route path="/dash" element={<Dashboard_layout_user />}>
        
{/*         <Route path="profile" element={<Profile />} />
         */}
        <Route path="service" element={<Service />} />
        <Route path="skill" element={<Skill />} />
        <Route path="project" element={<Project />} />
        <Route path="blog" element={<Blog />} />
        <Route path="testimony" element={<Testimonial />} />
        <Route path="education" element={<Education />} />
        <Route path="expriance" element={<Experience />} />

      </Route>
      <Route path="/dashboard_sp" element={<Dashboard_layout_serviceProvider />}>
        <Route path="users" element={<Users />} />
      </Route>




    </>
  )
);
