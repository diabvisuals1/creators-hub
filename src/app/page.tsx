import Hero from "@/components/sections/Hero";
import SiteIntro from "@/components/sections/SiteIntro";
import WayWeWork from "@/components/sections/WayWeWork";
import SelectedProjects from "@/components/sections/SelectedProjects";
import Testimonials from "@/components/sections/Testimonials";
import ContactUs from "@/components/sections/ContactUs";
import AboutUs from "@/components/sections/AboutUs";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <SiteIntro>
      <Hero />
      <WayWeWork />
      <SelectedProjects />
      <Testimonials />
      <ContactUs />
      <AboutUs />
      <Footer />
    </SiteIntro>
  );
}
