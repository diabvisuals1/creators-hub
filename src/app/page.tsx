import Hero from "@/components/sections/Hero";
import Reveal from "@/components/Reveal";
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
      <Reveal>
        <WayWeWork />
      </Reveal>
      <Reveal>
        <SelectedProjects />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <ContactUs />
      </Reveal>
      <Reveal>
        <AboutUs />
      </Reveal>
      <Reveal>
        <Footer />
      </Reveal>
    </SiteIntro>
  );
}
