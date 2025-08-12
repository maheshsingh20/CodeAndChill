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

  const cardGradients = [
    "from-lime-200 via-gray-200 to-cyan-100",
    "from-gray-200 via-cyan-100 to-lime-200",
    "from-cyan-100 via-lime-200 to-gray-200",
    "from-lime-200 via-cyan-100 to-gray-200",
    "from-cyan-100 via-gray-200 to-lime-200",
    "from-gray-200 via-lime-200 to-cyan-100",
  ];
  const borderColors = [
    "border-lime-300",
    "border-cyan-200",
    "border-gray-300",
    "border-cyan-200",
    "border-lime-300",
    "border-gray-300",
  ];
  const badgeColors = [
    "bg-lime-100 text-lime-800",
    "bg-cyan-100 text-cyan-800",
    "bg-gray-100 text-gray-800",
    "bg-cyan-100 text-cyan-800",
    "bg-lime-100 text-lime-800",
    "bg-gray-100 text-gray-800",
  ];

  return (
    <Section title="Upcoming Contests" viewAllLink="/contests">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest, idx) => (
          <div
            key={contest.name}
            className={`
              relative flex flex-col min-h-[320px] p-8 rounded-2xl border-2
              shadow-lg transition-shadow duration-300 hover:shadow-2xl
              bg-gradient-to-br ${cardGradients[idx % cardGradients.length]} 
              ${borderColors[idx % borderColors.length]}
            `}
          >
            <div className="flex items-center mb-4 gap-3 flex-wrap">
              <span
                className={`font-semibold rounded-md px-3 py-1 text-sm shadow-md ${badgeColors[idx % badgeColors.length]} bg-opacity-90`}
              >
                {contest.endsIn}
              </span>
              <span className="bg-white text-cyan-700 border border-cyan-200 rounded-md px-2 py-1 text-xs font-semibold select-none">
                {contest.level}
              </span>
            </div>
            <h3 className="text-cyan-900 text-2xl font-bold mb-2 drop-shadow-md leading-tight">
              {contest.name}
            </h3>
            <p className="text-cyan-900/80 mb-6 drop-shadow-sm font-medium">
              {contest.date} &bull; {contest.participants}
            </p>
            <div className="mt-auto">
              <Link to={contest.link} aria-label={`View details for ${contest.name}`}>
                <button
                  className="w-full rounded-xl bg-cyan-700 text-white font-semibold py-3 shadow-md
                    hover:bg-cyan-800 hover:shadow-lg transition duration-300"
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
            bg-gradient-to-r from-lime-300 via-cyan-300 to-gray-300
            text-cyan-900 shadow-lg hover:from-lime-400 hover:to-cyan-400
            transition duration-300"
        >
          See All Contests
        </Link>
      </div>
    </Section>
  );
}
