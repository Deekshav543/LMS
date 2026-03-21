import { Navigate, useParams } from 'react-router-dom'

// Backward-compatible route: Learning page is now the unified Course Details + Player experience.
export default function Learning() {
  const { courseId } = useParams()
  return <Navigate to={`/course/${courseId}`} replace />
}

