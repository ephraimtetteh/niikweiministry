
  
  export function ReviewSection({ title, children, onEdit }) {
    return (
      <div className="mb-6 border rounded-md p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium">{title}</h2>
          <button onClick={onEdit} className="text-teal-600 text-sm hover:text-teal-700">
            Edit
          </button>
        </div>
        <div className="bg-white rounded-lg p-4 space-y-1 text-sm">{children}</div>
      </div>
    )
  }
  
  