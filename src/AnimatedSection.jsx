import { motion } from 'framer-motion';

const AnimatedSection = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;