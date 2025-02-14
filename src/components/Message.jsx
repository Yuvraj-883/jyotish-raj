import { motion } from "framer-motion";

export default function Message({ sender, text }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className={`p-2 rounded-xl max-w-xs ${sender === "user" ? "self-end bg-blue-500 text-white" : "self-start bg-gray-200 text-black"}`}
    >
      {text}
    </motion.div>
  );
}
