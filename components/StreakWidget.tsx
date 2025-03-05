const StreakWidget = ({ streak }: { streak: number }) => {
  const maxDays: number = 7;
  const filledDays: number = streak % maxDays;

  return (
    <div className="flex items-center space-x-1 mt-2">
      {[...Array(maxDays)].map((_, i: number) => (
        <div key={i} className={`w-4 h-4 rounded-sm ${i < filledDays ? "bg-green-500" : "bg-gray-200"}`} />
      ))}
    </div>
  )
}

export default StreakWidget
