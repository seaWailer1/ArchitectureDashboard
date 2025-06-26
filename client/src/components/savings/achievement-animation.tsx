import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Crown, Medal, Target, Sparkles } from "lucide-react";

interface AchievementAnimationProps {
  achievement: {
    type: string;
    title: string;
    description: string;
    icon: any;
    color: string;
  };
  onComplete: () => void;
}

export default function AchievementAnimation({ achievement, onComplete }: AchievementAnimationProps) {
  const [showParticles, setShowParticles] = useState(false);
  const Icon = achievement.icon;

  useEffect(() => {
    setShowParticles(true);
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate particle positions
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 2,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        {/* Particles Background */}
        {showParticles && (
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [-20, -100],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}

        {/* Main Achievement Card */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1], 
            rotate: [180, 0, 0], 
            opacity: 1,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            times: [0, 0.6, 1],
          }}
          className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl border-4 border-yellow-400"
        >
          {/* Achievement Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 ${achievement.color}`}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>

          {/* Sparkle Effects */}
          <div className="relative">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${10 + (i % 2) * 20}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            ))}
          </div>

          {/* Achievement Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {achievement.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {achievement.description}
            </p>
          </motion.div>

          {/* Celebration Badges */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="flex justify-center space-x-2"
          >
            {achievement.type === 'challenge_completed' && (
              <>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
              </>
            )}
            {achievement.type === 'milestone_reached' && (
              <div className="p-2 bg-blue-100 rounded-full">
                <Medal className="w-6 h-6 text-blue-600" />
              </div>
            )}
            {achievement.type === 'challenge_started' && (
              <div className="p-2 bg-green-100 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            )}
          </motion.div>

          {/* Progress Bar Animation */}
          {achievement.type === 'milestone_reached' && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                initial={{ y: 0, opacity: 1, scale: 0 }}
                animate={{
                  y: [-10, -50, -80],
                  opacity: [1, 0.8, 0],
                  scale: [0, 1, 0.5],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 3,
                  delay: 1 + i * 0.2,
                  ease: "easeOut",
                }}
              >
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              </motion.div>
            ))}
          </div>

          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 border-4 border-yellow-400 rounded-2xl"
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              scale: [1, 1.1, 1.2],
              opacity: [1, 0.5, 0],
            }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: "easeOut",
            }}
          />

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl opacity-20"
            initial={{ scale: 0.8 }}
            animate={{
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Confetti Effect */}
        {showParticles && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className={`absolute w-3 h-3 ${
                  i % 4 === 0 ? 'bg-yellow-400' :
                  i % 4 === 1 ? 'bg-blue-400' :
                  i % 4 === 2 ? 'bg-red-400' : 'bg-green-400'
                } rounded-sm`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-5%`,
                }}
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  y: typeof window !== 'undefined' ? window.innerHeight + 50 : 800,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  opacity: [1, 1, 0],
                  x: [(Math.random() - 0.5) * 100],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}