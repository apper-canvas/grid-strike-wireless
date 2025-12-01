import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface flex items-center justify-center p-4">
      <motion.div 
        className="text-center space-y-8 max-w-lg mx-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Display */}
        <motion.div
          className="relative"
          animate={{ 
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-9xl font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-success neon-text">
            404
          </div>
          <div className="absolute inset-0 text-9xl font-display text-primary/10 blur-xl">
            404
          </div>
        </motion.div>

        {/* Error Message */}
        <div className="space-y-4">
          <motion.h1 
            className="text-4xl font-display text-white neon-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Game Not Found
          </motion.h1>
          
          <motion.p 
            className="text-white/70 text-lg font-sans leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Looks like you've wandered into the digital void! The page you're looking for doesn't exist in our neon universe.
          </motion.p>
        </div>

        {/* Grid Pattern Decoration */}
        <motion.div 
          className="flex justify-center items-center gap-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }, (_, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 border-2 border-primary/20 rounded bg-surface/30"
                animate={{ 
                  borderColor: ["rgba(99, 102, 241, 0.2)", "rgba(99, 102, 241, 0.8)", "rgba(99, 102, 241, 0.2)"]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Navigation Actions */}
        <motion.div 
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-3"
            size="lg"
          >
            <ApperIcon name="Home" size={20} />
            Back to Game
          </Button>

          <p className="text-white/50 text-sm font-sans">
            Let's get you back to the neon battlefield!
          </p>
        </motion.div>

        {/* Ambient Glow Effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound