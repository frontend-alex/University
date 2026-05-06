import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-32 lg:pt-16">
        <section className="container mx-auto relative h-[80vh] min-h-[600px] flex flex-col lg:flex-row items-center justify-center">
          <div className="mx-auto px-4 z-10">
            <div className="max-w-3xl">
              <Badge variant={"secondary"} className="mb-4">
                Productivity Made Simple
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Organize Your Life, Seamlessly
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Manage tasks, set goals, track habits — all in one powerful,
                beautifully designed productivity app.
              </p>

              <div className="-left-[30%] top-32 absolute bg-indigo-500 w-[400px] h-[400px] lg:w-[700px] lg:h-[700px] rounded-full z-[-1000] blur-[100px] opacity-80" />

              <form className="relative max-w-md mb-8">
                <Input
                  type="text"
                  placeholder="Search tasks, list or users"
                  className="h-12 pl-12 input-register no-ring"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <Button
                  type="submit"
                  className="absolute right-0 top-0 h-12 rounded-l-none"
                >
                  Search
                </Button>
              </form>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild size="lg" variant={"outline"}>
                  <Link to="/features">Explore Features</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
