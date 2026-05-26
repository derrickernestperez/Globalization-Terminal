import { motion } from 'framer-motion';

const orbitTransition = {
  duration: 18,
  ease: 'linear',
  repeat: Number.POSITIVE_INFINITY,
};

export default function AnimatedGlobe() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
      <motion.div
        className="absolute inset-6 rounded-full border border-[#7C8F7A]/35"
        animate={{ rotate: 360 }}
        transition={orbitTransition}
      />
      <motion.div
        className="absolute inset-12 rounded-full border border-[#D9CDB6]/35"
        animate={{ rotate: -360 }}
        transition={{ ...orbitTransition, duration: 22 }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(253,249,240,0.7),transparent_32%),radial-gradient(circle_at_70%_75%,rgba(124,143,122,0.22),transparent_28%)] blur-2xl"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-10 overflow-hidden rounded-full border border-[#D9CDB6]/70 bg-[linear-gradient(160deg,#16314A_0%,#1F3E5B_48%,#2D4E67_100%)] shadow-[0_30px_80px_rgba(14,28,43,0.35)]"
        initial={{ rotate: -8, scale: 0.96, opacity: 0.8 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 320 320" className="h-full w-full">
          <defs>
            <linearGradient id="land" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D9CDB6" />
              <stop offset="100%" stopColor="#B7C3A9" />
            </linearGradient>
          </defs>

          <circle cx="160" cy="160" r="158" fill="transparent" stroke="rgba(253,249,240,0.14)" />
          <path
            d="M58 138C82 118 92 84 128 77C143 74 154 83 168 87C186 93 204 84 223 86C246 89 267 104 274 124C283 147 271 172 255 189C240 205 221 220 198 225C173 231 147 221 125 213C106 206 84 200 70 183C58 168 43 149 58 138Z"
            fill="url(#land)"
            opacity="0.92"
          />
          <path
            d="M100 92C112 103 120 118 139 119C157 120 167 102 184 99C198 97 213 105 218 118C224 133 214 148 206 159C197 171 188 184 173 187C154 191 138 179 121 170C107 162 92 152 88 137C84 122 89 104 100 92Z"
            fill="#8DA588"
            opacity="0.74"
          />
          <path
            d="M83 204C102 193 124 204 142 213C157 221 175 228 188 240C198 250 208 265 201 278C194 292 175 300 159 298C140 296 125 283 111 271C98 260 82 248 77 231C74 221 73 210 83 204Z"
            fill="#D9CDB6"
            opacity="0.68"
          />

          <g stroke="rgba(253,249,240,0.12)" strokeWidth="1">
            <ellipse cx="160" cy="160" rx="126" ry="42" fill="none" />
            <ellipse cx="160" cy="160" rx="126" ry="92" fill="none" />
            <ellipse cx="160" cy="160" rx="126" ry="126" fill="none" />
            <path d="M160 34C132 74 120 114 120 160C120 206 132 246 160 286" fill="none" />
            <path d="M160 34C188 74 200 114 200 160C200 206 188 246 160 286" fill="none" />
          </g>
        </svg>
      </motion.div>

      <motion.div
        className="absolute left-[16%] top-[18%] h-3 w-3 rounded-full bg-[#FDF9F0] shadow-[0_0_30px_rgba(253,249,240,0.9)]"
        animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[22%] right-[18%] h-4 w-4 rounded-full bg-[#B7C3A9] shadow-[0_0_30px_rgba(183,195,169,0.75)]"
        animate={{ scale: [1, 1.25, 1], opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
    </div>
  );
}
