import React from "react";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

const contestsUpcoming = [
  {
    id: "algo-master-final",
    title: "AlgoMaster Monthly Finals",
    category: "Algorithm",
    level: "Intermediate",
    startsIn: "19d",
  },
  {
    id: "code-sprint",
    title: "CodeSprint Challenge",
    category: "Speed",
    level: "Beginner",
    startsIn: "25d",
  },
  {
    id: "hackathon-blitz",
    title: "Hackathon Blitz",
    category: "Hackathon",
    level: "Advanced",
    startsIn: "35d",
  },
];

const contestsPast = [
  {
    id: "july-codesprint",
    title: "July CodeSprint",
    category: "Speed",
    level: "Beginner",
    ended: true,
  },
  {
    id: "summer-hackathon",
    title: "Summer Hackathon",
    category: "Hackathon",
    level: "Advanced",
    ended: true,
  },
];

// Utility: Badge colors by level (using cyan-lime palette)
const levelColors = {
  Beginner: "bg-lime-100 text-lime-700",
  Intermediate: "bg-cyan-100 text-cyan-700",
  Advanced: "bg-purple-100 text-purple-700", // keep purple for distinction
};

const categoryColors = {
  Algorithm: "bg-gray-100 text-gray-800",
  Speed: "bg-yellow-100 text-yellow-800",
  Hackathon: "bg-pink-100 text-pink-700",
};

export function ContestsPage() {
  return (
    <div className="bg-gradient-to-b from-lime-100 via-gray-100 to-cyan-100 min-h-screen py-12">
      <div className="container mx-auto max-w-7xl px-6 space-y-12">
        {/* Upcoming Contests */}
        <section>
          <h2 className="text-3xl font-extrabold mb-8 text-cyan-900 drop-shadow">
            Upcoming & Live Contests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {contestsUpcoming.map((contest) => (
              <div
                key={contest.id}
                className="bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100 shadow-xl rounded-2xl p-8 flex flex-col justify-between hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300"
              >
                <div className="flex justify-between mb-4">
                  <span
                    className={`inline-block px-4 py-1 text-xs font-semibold rounded-full ${categoryColors[contest.category]}`}
                  >
                    {contest.category}
                  </span>
                  <span
                    className={`inline-block px-4 py-1 text-xs font-semibold rounded-full ${levelColors[contest.level]}`}
                  >
                    {contest.level}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold mb-4 text-cyan-900 drop-shadow">
                  {contest.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-cyan-800 mb-6">
                  <Clock className="w-5 h-5" />
                  <span>Starts in {contest.startsIn}</span>
                </div>
                <Link
                  to={`/contests/:contestId`}
                  className="inline-block bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-xl py-3 text-center shadow transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Past Contests */}
        <section>
          <h2 className="text-3xl font-extrabold mb-8 text-cyan-900 drop-shadow">
            Past Contests Archive
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {contestsPast.map((contest) => (
              <div
                key={contest.id}
                className="bg-gradient-to-br from-gray-100 via-lime-50 to-cyan-50 shadow rounded-2xl p-8 flex flex-col justify-between opacity-80 cursor-not-allowed select-none"
              >
                <div className="flex justify-between mb-4">
                  <span
                    className={`inline-block px-4 py-1 text-xs font-semibold rounded-full ${categoryColors[contest.category]}`}
                  >
                    {contest.category}
                  </span>
                  <span
                    className={`inline-block px-4 py-1 text-xs font-semibold rounded-full ${levelColors[contest.level]}`}
                  >
                    {contest.level}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold mb-4 text-cyan-900 drop-shadow">
                  {contest.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-cyan-700 mb-6">
                  <Clock className="w-5 h-5" />
                  <span>Contest has ended</span>
                </div>
                <button
                  disabled
                  className="w-full bg-gray-400 text-gray-200 font-semibold rounded-xl py-3 cursor-not-allowed"
                >
                  View Archive
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
