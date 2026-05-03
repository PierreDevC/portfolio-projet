export default function TimelineItem({ item, isLast }) {
    return (
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-violet-600 mt-1.5 shrink-0" />
          {!isLast && <div className="w-0.5 bg-gray-200 dark:bg-gray-700 flex-1 mt-1" />}
        </div>
        <div className={`pb-8 ${isLast ? '' : ''}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
              {item.type === 'formation' ? 'Formation' : 'Emploi'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.period}</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
          <p className="text-sm text-violet-600 dark:text-violet-400 mb-1">{item.organization}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
        </div>
      </div>
    )
  }