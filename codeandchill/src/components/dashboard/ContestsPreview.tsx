import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, Trophy, ArrowRight, Zap } from "lucide-react";

const levelColors = {
  Beginner: "bg-green-500/20 text-green-300 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-300 border-red-500/30"
};

export function ContestsPreview() {
  const contests = [
    {
      name: "AlgoMaster Monthly Finals",
      date: "August 30, 2025",
      participants: "1,204 Registered",
      endsIn: "3 Days",
      level: "Intermediate",
      link: "/contests/algomaster-finals",
      prize: "$5,000",
      difficulty: 7,
    },
    {
      name: "CodeSprint Challenge",
      date: "September 5, 2025",
      participants: "2,010 Registered",
      endsIn: "9 Days",
      level: "Beginner",
      link: "/contests/codesprint",
      prize: "$2,500",
      difficulty: 4,
    },
    {
      name: "Hackathon Blitz",
      date: "September 15, 2025",
      participants: "3,500 Registered",
      endsIn: "19 Days",
      level: "Advanced",
      link: "/contests/hackathon-blitz",
      prize: "$10,000",
      difficulty: 9,
    },
  ];

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-3">
            <Zap className="text-yellow-400" size={32} />
            Upcoming Contests
          </h2>
          <p className="text-gray-400 mt-2">
            Compete with developers worldwide and win prizes
          </p>
        </div>
        <Link to="/contests">
          <div className="px-6 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md hover:border-gray-500 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
              View All Contests
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest, index) => (
          <motion.div
            key={contest.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="group h-full"
          >
            <Link to={contest.link} className="block h-full">
              <div className="h-full min-h-[360px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-md text-xs font-medium ${levelColors[contest.level] || levelColors.Intermediate}`}>
                        {contest.level}
                      </div>
                      <div className="px-3 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md text-xs font-medium">
                        <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                          {contest.endsIn}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-4">
                    {/* Title */}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-yellow-100 group-hover:to-yellow-200 transition-all duration-300">
                      {contest.name}
                    </h3>

                    {/* Contest Details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {contest.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-500" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {contest.participants}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Trophy size={14} className="text-yellow-400" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          Prize: {contest.prize}
                        </span>
                      </div>
                    </div>

                    {/* Difficulty Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          Difficulty
                        </span>
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {contest.difficulty}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                          style={{ width: `${(contest.difficulty / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                        Join Contest
                      </span>
                      <div className="w-4 h-0.5 bg-gray-600 rounded-sm group-hover:bg-gray-500 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}