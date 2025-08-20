import { Section } from "./Section";
import { Link } from "react-router-dom";

export function ContestsPreview() {
  const contests = [
    {
      name: "AlgoMaster Monthly Finals",
      date: "August 30, 2025",
      participants: "1,204 Registered",
      endsIn: "3 Days",
      level: "Intermediate",
      link: "/contests/algomaster-finals",
    },
    {
      name: "CodeSprint Challenge",
      date: "September 5, 2025",
      participants: "2,010 Registered",
      endsIn: "9 Days",
      level: "Beginner",
      link: "/contests/codesprint",
    },
    {
      name: "Hackathon Blitz",
      date: "September 15, 2025",
      participants: "3,500 Registered",
      endsIn: "19 Days",
      level: "Advanced",
      link: "/contests/hackathon-blitz",
    },
    {
      name: "Frontend Fiesta",
      date: "September 20, 2025",
      participants: "1,800 Registered",
      endsIn: "24 Days",
      level: "Beginner",
      link: "/contests/frontend-fiesta",
    },
    {
      name: "Data Science Derby",
      date: "October 2, 2025",
      participants: "2,300 Registered",
      endsIn: "36 Days",
      level: "Intermediate",
      link: "/contests/data-science-derby",
    },
    {
      name: "AI Arena",
      date: "October 10, 2025",
      participants: "4,100 Registered",
      endsIn: "44 Days",
      level: "Advanced",
      link: "/contests/ai-arena",
    },
  ];

  const badgeColors = [
    "bg-cyan-900/70 text-cyan-300",
    "bg-purple-900/70 text-purple-300",
    "bg-green-900/70 text-green-300",
    "bg-orange-900/70 text-orange-300",
    "bg-pink-900/70 text-pink-300",
    "bg-blue-900/70 text-blue-300",
  ];

  return (
    <Section title="Upcoming Contests" viewAllLink="/contests">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest, idx) => (
          <div
            key={contest.name}
            className="relative flex flex-col min-h-[320px] p-6 rounded-2xl
                       border border-gray-800 shadow-lg
                       bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950
                       backdrop-blur-xl transition-all duration-300
                       hover:shadow-neon hover:scale-[1.02]"
          >
            <div className="flex items-center mb-4 gap-3 flex-wrap">
              <span
                className={`font-semibold rounded-md px-3 py-1 text-sm ${
                  badgeColors[idx % badgeColors.length]
                } backdrop-blur-md`}
              >
                {contest.endsIn}
              </span>
              <span className="bg-gray-800/50 text-gray-300 border border-gray-700 rounded-md px-2 py-1 text-xs font-semibold select-none">
                {contest.level}
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2 leading-tight text-gray-100 drop-shadow-md">
              {contest.name}
            </h3>

            <p className="mb-6 font-medium text-gray-300 drop-shadow-sm">
              {contest.date} &bull; {contest.participants}
            </p>

            <div className="mt-auto">
              <Link
                to={contest.link}
                aria-label={`View details for ${contest.name}`}
              >
                <button
                  className="w-full rounded-xl bg-gradient-to-r from-primary/80 to-secondary/80
                             text-primary-foreground font-semibold py-3 shadow-lg
                             hover:from-primary hover:to-secondary hover:shadow-neon
                             transition duration-300"
                >
                  View Contest
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/contests"
          className="inline-block px-8 py-3 rounded-full font-bold
                     bg-gradient-to-r from-primary/80 to-secondary/80
                     text-primary-foreground shadow-lg hover:from-primary hover:to-secondary
                     transition duration-300"
        >
          See All Contests
        </Link>
      </div>
    </Section>
  );
}
