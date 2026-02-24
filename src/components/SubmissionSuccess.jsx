import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

function SuccessMessage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-md w-full p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 text-center"
      >
        {/* Animated Check Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 12,
            delay: 0.3,
          }}
          className="flex justify-center mb-4"
        >
          <CheckCircle className="w-20 h-20" style={{ color: "#f4793d" }} />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-bold mb-2"
          style={{ color: "#f4793d" }}
        >
          Thanks!
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-gray-600 text-lg mb-6"
        >
          Your form has been submitted successfully.
        </motion.p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoBack}
          className="transition text-white font-semibold px-6 py-2 rounded-full"
          style={{
            backgroundColor: "#f4793d",
            boxShadow: "0 2px 8px rgba(244, 121, 61, 0.4)",
          }}
        >
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}

export default SuccessMessage;
