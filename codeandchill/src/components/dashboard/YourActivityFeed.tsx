import { Section } from "./Section";
import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle, Flame } from "lucide-react";

export function YourActivityFeed() {
  const activities = [
    {
      icon: <CheckCircle className="text-cyan-600 bg-cyan-100 rounded-full p-1" size={28} />,
      text: "Completed 'React Hooks' quiz",
      time: "2 hours ago",
      bg: "from-lime-200 via-gray-200 to-cyan-100",
    },
    {
      icon: <Award className="text-yellow-600 bg-yellow-100 rounded-full p-1" size={28} />,
      text: "Earned 'Python Pro' badge",
      time: "1 day ago",
      bg: "from-gray-200 via-cyan-100 to-lime-200",
    },
    {
      icon: <Flame className="text-pink-600 bg-pink-100 rounded-full p-1" size={28} />,
      text: "Maintained a 5-day streak!",
      time: "2 days ago",
      bg: "from-cyan-100 via-lime-200 to-gray-200",
    },
  ];

  return (
    <Section title="Your Activity">
      <Card className="rounded-2xl shadow-xl border-2 border-cyan-200 bg-gradient-to-br from-lime-200 via-gray-200 to-cyan-100 p-6">
        <ul className="space-y-5">
          {activities.map((activity, idx) => (
            <li
              key={activity.text}
              className={`
                flex items-start gap-4 p-4 rounded-xl
                bg-gradient-to-r ${activity.bg}
                hover:scale-[1.02] hover:shadow transition
              `}
            >
              <div className="mt-1">{activity.icon}</div>
              <div>
                <p className="font-semibold text-cyan-900 text-sm">{activity.text}</p>
                <p className="text-xs text-gray-600">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </Section>
  );
}