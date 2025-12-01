import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const ScorePanel = ({ xWins, oWins, draws }) => {
  const scoreItems = [
    { label: "X Wins", value: xWins, color: "text-primary", bg: "bg-primary/10", icon: "X" },
    { label: "O Wins", value: oWins, color: "text-secondary", bg: "bg-secondary/10", icon: "Circle" },
    { label: "Draws", value: draws, color: "text-warning", bg: "bg-warning/10", icon: "Equal" }
  ]

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-center">
          <ApperIcon name="BarChart3" className="text-primary" size={24} />
          Score Board
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scoreItems.map((item, index) => (
          <motion.div
            key={item.label}
            className={`flex items-center justify-between p-4 rounded-lg border ${item.bg} border-white/10`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${item.bg}`}>
                <ApperIcon name={item.icon} className={item.color} size={18} />
              </div>
              <span className="font-semibold text-white">{item.label}</span>
            </div>
            <motion.span 
              className={`text-2xl font-display font-bold ${item.color} neon-text`}
              key={item.value}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {item.value}
            </motion.span>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

export default ScorePanel