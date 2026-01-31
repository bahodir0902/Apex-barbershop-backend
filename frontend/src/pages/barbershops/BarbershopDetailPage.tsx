import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Calendar,
  Scissors,
  ArrowLeft,
  Users
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardContent, 
  Avatar, 
  Badge,
  Skeleton
} from '@/components/ui';
import { barbershopService } from '@/services/barbershop';
import { formatCurrency } from '@/lib/utils';

export function BarbershopDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: barbershop, isLoading: barbershopLoading } = useQuery({
    queryKey: ['barbershop', id],
    queryFn: () => barbershopService.getBarbershop(id!),
    enabled: !!id,
  });

  const { data: barbersData } = useQuery({
    queryKey: ['barbershop-barbers', id],
    queryFn: () => barbershopService.getBarbershopBarbers(id!),
    enabled: !!id,
  });

  const { data: haircutsData } = useQuery({
    queryKey: ['barbershop-haircuts', id],
    queryFn: () => barbershopService.getBarbershopHaircuts(id!),
    enabled: !!id,
  });

  if (barbershopLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Scissors className="h-16 w-16 text-dark-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            Barbershop Not Found
          </h2>
          <Button asChild>
            <Link to="/barbershops">Back to Barbershops</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/barbershops"
            className="inline-flex items-center gap-2 text-dark-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Barbershops
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="elevated" className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gold-200 to-gold-400 dark:from-gold-900 dark:to-gold-700 relative">
                  {barbershop.picture ? (
                    <img
                      src={barbershop.picture}
                      alt={barbershop.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Scissors className="h-24 w-24 text-gold-600 dark:text-gold-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white mb-2">
                        {barbershop.name}
                      </h1>
                      <div className="flex items-center gap-2 text-dark-500 dark:text-dark-400">
                        <MapPin className="h-4 w-4" />
                        <span>{barbershop.address}</span>
                      </div>
                    </div>
                    <Badge variant={barbershop.is_active ? 'success' : 'default'} size="lg">
                      {barbershop.is_active ? 'Open' : 'Closed'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-gold-400 fill-gold-400" />
                      <span className="text-lg font-semibold text-dark-900 dark:text-white">
                        {barbershop.average_rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-dark-500">
                      <Users className="h-5 w-5" />
                      <span>{barbershop.total_barbers || 0} barbers</span>
                    </div>
                  </div>

                  {barbershop.description && (
                    <p className="text-dark-600 dark:text-dark-300">
                      {barbershop.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Barbers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
                Our Barbers
              </h2>
              {barbersData?.data && barbersData.data.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {barbersData.data.map((barber) => (
                    <Card key={barber.id} variant="elevated" hoverable>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar
                            src={barber.picture}
                            alt={barber.full_name}
                            fallback={barber.full_name}
                            size="lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-dark-900 dark:text-white truncate">
                              {barber.full_name}
                            </h3>
                            <p className="text-sm text-dark-500 dark:text-dark-400">
                              {barber.experienced_years} years experience
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 text-gold-400 fill-gold-400" />
                              <span className="text-sm font-medium text-dark-700 dark:text-dark-200">
                                {barber.average_rating?.toFixed(1) || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/book?barber=${barber.id}&barbershop=${barbershop.id}`}>
                              Book
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card variant="outlined">
                  <CardContent className="p-6 text-center text-dark-500">
                    No barbers available at the moment.
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
                Services
              </h2>
              {haircutsData?.data && haircutsData.data.length > 0 ? (
                <div className="space-y-3">
                  {haircutsData.data.map((haircut) => (
                    <Card key={haircut.id} variant="elevated">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gold-100 dark:bg-gold-900/30">
                              <Scissors className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-dark-900 dark:text-white">
                                {haircut.name}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-dark-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {haircut.duration_minutes} min
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gold-600 dark:text-gold-400">
                              {formatCurrency(haircut.price)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card variant="outlined">
                  <CardContent className="p-6 text-center text-dark-500">
                    No services available at the moment.
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Now Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="elevated" className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                    Book an Appointment
                  </h3>
                  <p className="text-sm text-dark-500 dark:text-dark-400 mb-6">
                    Choose your preferred barber and time slot to book your appointment.
                  </p>
                  <Button className="w-full glow-gold" size="lg" asChild>
                    <Link to={`/book?barbershop=${barbershop.id}`}>
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                    Contact Info
                  </h3>
                  <div className="space-y-3">
                    {barbershop.phone_number && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gold-100 dark:bg-gold-900/30">
                          <Phone className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                        </div>
                        <a
                          href={`tel:${barbershop.phone_number}`}
                          className="text-dark-700 dark:text-dark-200 hover:text-gold-600"
                        >
                          {barbershop.phone_number}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gold-100 dark:bg-gold-900/30">
                        <MapPin className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                      </div>
                      <span className="text-dark-700 dark:text-dark-200">
                        {barbershop.address}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
