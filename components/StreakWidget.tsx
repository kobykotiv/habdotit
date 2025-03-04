const StreakWidget = ({ streak }) => {
  const maxDays = 7
  const filledDays = streak % maxDays

  return (
    <div className="flex items-center space-x-1 mt-2">
      {[...Array(maxDays)].map((_, i) => (
        <div key={i} className={`w-4 h-4 rounded-sm ${i < filledDays ? "bg-green-500" : "bg-gray-200"}`} />
      ))}
    </div>
  )
}

export default StreakWidget
