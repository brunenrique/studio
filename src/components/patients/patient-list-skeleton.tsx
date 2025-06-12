import Skeleton from "@/components/Skeleton"

export function PatientListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-2">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export function PatientListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <PatientListItemSkeleton key={i} />
      ))}
    </div>
  )
}
