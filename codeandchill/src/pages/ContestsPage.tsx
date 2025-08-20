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

const levelColors = {
  Beginner: "border-pink-400 text-pink-400",
  Intermediate: "border-red-400 text-red-400",
  Advanced: "border-violet-400 text-violet-400",
};

const categoryColors = {
  Algorithm: "border-red-300 text-red-300",
  Speed: "border-pink-300 text-pink-300",
  Hackathon: "border-violet-300 text-violet-300",
};

export function ContestsPage() {
  return (
    <div className="bg-gray-900 min-h-screen py-12 font-sans text-white px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Upcoming Contests */}
        <section>
          <h2 className="text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-red-400 to-violet-400">
            Upcoming & Live Contests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {contestsUpcoming.map((contest) => (
              <div
                key={contest.id}
                className="bg-gray-850/80 border border-gray-700 p-6 flex flex-col justify-between rounded-xl hover:border-gradient-to-r hover:from-pink-400 hover:via-red-400 hover:to-violet-400 transition-all duration-300"
              >
                <div className="flex justify-between mb-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      categoryColors[contest.category]
                    }`}
                  >
                    {contest.category}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      levelColors[contest.level]
                    }`}
                  >
                    {contest.level}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-pink-300">
                  {contest.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-red-300 mb-6">
                  <Clock className="w-5 h-5" />
                  <span>Starts in {contest.startsIn}</span>
                </div>
                <Link
                  to={`/contests/${contest.id}`}
                  className="w-full text-center py-2 bg-gradient-to-r from-pink-400 via-red-400 to-violet-400 text-white font-medium rounded-lg hover:brightness-110 transition-all"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Past Contests */}
        <section>
          <h2 className="text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-red-400 to-violet-400">
            Past Contests Archive
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {contestsPast.map((contest) => (
              <div
                key={contest.id}
                className="bg-gray-850/70 border border-gray-700 p-6 flex flex-col justify-between rounded-xl opacity-70 cursor-not-allowed select-none"
              >
                <div className="flex justify-between mb-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      categoryColors[contest.category]
                    }`}
                  >
                    {contest.category}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      levelColors[contest.level]
                    }`}
                  >
                    {contest.level}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-pink-300">
                  {contest.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-red-300 mb-6">
                  <Clock className="w-5 h-5" />
                  <span>Contest has ended</span>
                </div>
                <button
                  disabled
                  className="w-full py-2 bg-gray-700 text-gray-300 font-medium rounded-lg cursor-not-allowed"
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
