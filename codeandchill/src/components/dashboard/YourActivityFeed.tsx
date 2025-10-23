/* eslint-disable @typescript-eslint/no-unused-vars */
import { Section } from "./Section";
import { Card } from "@/components/ui/card";
import { Award, CheckCircle, Flame } from "lucide-react";

export function YourActivityFeed() {
  const activities = [
    {
      icon: (
        <CheckCircle
          className="text-cyan-400 bg-cyan-900/20 rounded-full p-1"
          size={28}
        />
      ),
      text: "Completed 'React Hooks' quiz",
      time: "2 hours ago",
      bg: "from-gray-950 via-gray-900 to-gray-950",
      textGradient: "text-cyan-300",
    },
    {
      icon: (
        <Award
          className="text-yellow-400 bg-yellow-900/20 rounded-full p-1"
          size={28}
        />
      ),
      text: "Earned 'Python Pro' badge",
      time: "1 day ago",
      bg: "from-gray-950 via-gray-900 to-gray-950",
      textGradient: "text-yellow-300",
    },
    {
      icon: (
        <Flame
          className="text-pink-400 bg-pink-900/20 rounded-full p-1"
          size={28}
        />
      ),
      text: "Maintained a 5-day streak!",
      time: "2 days ago",
      bg: "from-gray-950 via-gray-900 to-gray-950",
      textGradient: "text-pink-300",
    },
  ];

  return (
    <Section title="Your Activity">
      <Card className="rounded-2xl shadow-xl border border-gray-800 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
        <ul className="space-y-5">
          {activities.map((activity, idx) => (
            <li
              key={activity.text}
              className={`
                flex items-start gap-4 p-4 rounded-xl
                bg-gradient-to-r ${activity.bg}
                hover:scale-[1.02] hover:shadow-xl transition-all duration-300
                cursor-pointer
              `}
            >
              <div className="mt-1">{activity.icon}</div>
              <div className="flex flex-col">
                <p
                  className={`font-semibold ${activity.textGradient} text-sm drop-shadow`}
                >
                  {activity.text}
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </Section>
  );
}
