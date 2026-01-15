import { Award, CheckCircle, Flame, Activity } from "lucide-react";

export function YourActivityFeed() {
  const activities = [
    {
      icon: CheckCircle,
      iconColor: "text-green-400",
      text: "Completed 'React Hooks' quiz",
      time: "2 hours ago",
    },
    {
      icon: Award,
      iconColor: "text-yellow-400",
      text: "Earned 'Python Pro' badge",
      time: "1 day ago",
    },
    {
      icon: Flame,
      iconColor: "text-orange-400",
      text: "Maintained a 5-day streak!",
      time: "2 days ago",
    },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-3">
          <Activity className="text-blue-400" size={32} />
          Your Activity
        </h2>
        <p className="text-gray-400 mt-2">
          Track your recent achievements and progress
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div key={idx} className="group">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md group-hover:border-gray-500 transition-all duration-300">
                  <activity.icon className={`w-6 h-6 ${activity.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <p className="font-bold text-lg bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-blue-100 group-hover:to-blue-200 transition-all duration-300">
                    {activity.text}
                  </p>
                  <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
