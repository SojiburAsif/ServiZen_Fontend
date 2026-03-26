import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import LoadingBackground from "@/components/shared/static/LoadingBackground";


export default function ReviewsLoading() {
  return (
    <LoadingBackground>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Reviews</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and view your service reviews</p>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-8 w-12 bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rating Distribution Skeleton */}
        <Card className="animate-pulse">
          <div className="p-6">
            <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-700 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-8 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <Skeleton className="h-4 w-6 bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Filters Skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-1 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-10 w-full sm:w-48 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-10 w-full sm:w-48 bg-gray-200 dark:bg-gray-700" />
            </div>
          </CardContent>
        </Card>

        {/* Reviews List Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, j) => (
                        <Skeleton key={j} className="h-4 w-4 bg-gray-200 dark:bg-gray-700" />
                      ))}
                    </div>
                    <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </LoadingBackground>
  );
}