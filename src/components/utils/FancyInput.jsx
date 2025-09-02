import React from 'react'
import { motion } from 'framer-motion'

const FancyInput = ({ label, error, className = "", inputClassName = "", ...props }) => {
  return (
    <label className={`block ${className}`}>
      {label ? <span className="text-sm opacity-80">{label}</span> : null}
      <motion.div
        className={`mt-1 rounded-xl border transition-all ${error ? 'border-rose-400' : 'border-gray-200'} focus-within:border-blue-500 focus-within:shadow-[var(--elev-1)]`}
        whileFocus={{}}
      >
        <input
          {...props}
          className={`w-full bg-transparent px-4 py-3 outline-none rounded-xl ${inputClassName}`}
        />
      </motion.div>
      {error ? <p className="text-rose-500 text-xs mt-1">{error}</p> : null}
    </label>
  )
}

export default FancyInput


