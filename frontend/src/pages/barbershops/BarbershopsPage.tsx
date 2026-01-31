import * as React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  Scissors,
  ArrowUpDown
} from 'lucide-react';
import { 
  Button, 
  Input, 
  Card, 
  CardContent, 
  SkeletonCard,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui';
import { barbershopService } from '@/services/barbershop';

export function BarbershopsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [ordering, setOrdering] = React.useState(searchParams.get('ordering') || 'name');
  const [page, setPage] = React.useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['barbershops', { search: searchQuery, ordering, page }],
    queryFn: () => barbershopService.getBarbershops({ search: searchQuery, ordering, page }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ search: searchQuery, ordering });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Find Your Perfect <span className="gradient-text">Barbershop</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
              Discover the best barbershops near you with skilled professionals ready to give you the perfect look.
            </p>

            {/* Search form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="h-5 w-5" />}
                    className="!bg-dark-800 !border-dark-700"
                  />
                </div>
                <Button type="submit" size="lg">
                  Search
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="text-dark-600 dark:text-dark-400">
              {data?.count !== undefined && (
                <span>Found {data.count} barbershops</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Select value={ordering} onValueChange={setOrdering}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="-name">Name (Z-A)</SelectItem>
                  <SelectItem value="-created_at">Newest First</SelectItem>
                  <SelectItem value="created_at">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load barbershops. Please try again.</p>
            </div>
          ) : data?.results?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Scissors className="h-16 w-16 text-dark-300 dark:text-dark-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
                No Barbershops Found
              </h3>
              <p className="text-dark-500 dark:text-dark-400">
                Try adjusting your search criteria
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.results?.map((barbershop, i) => (
                <motion.div
                  key={barbershop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card variant="elevated" hoverable className="overflow-hidden h-full">
                    <div className="aspect-video bg-gradient-to-br from-gold-200 to-gold-400 dark:from-gold-900 dark:to-gold-700 relative">
                      {barbershop.picture ? (
                        <img
                          src={barbershop.picture}
                          alt={barbershop.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Scissors className="h-12 w-12 text-gold-600 dark:text-gold-400" />
                        </div>
                      )}
                      {/* Active badge */}
                      {barbershop.is_active && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
                          Open
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-4 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                        {barbershop.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-dark-500 dark:text-dark-400 mb-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{barbershop.address}</span>
                      </div>
                      {barbershop.description && (
                        <p className="text-sm text-dark-500 dark:text-dark-400 mb-3 line-clamp-2">
                          {barbershop.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-gold-400 fill-gold-400" />
                          <span className="font-medium text-dark-900 dark:text-white">
                            {barbershop.average_rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-dark-500">
                          <Users className="h-4 w-4" />
                          <span>{barbershop.total_barbers || 0} barbers</span>
                        </div>
                      </div>
                      <Button className="w-full" asChild>
                        <Link to={`/barbershops/${barbershop.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && (data.next || data.previous) && (
            <div className="flex justify-center gap-4 mt-12">
              <Button
                variant="outline"
                disabled={!data.previous}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={!data.next}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
