import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Scissors, 
  Star, 
  Clock, 
  Calendar, 
  MapPin, 
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Sparkles
} from 'lucide-react';
import { Button, Card, CardContent, Avatar, SkeletonCard } from '@/components/ui';
import { barbershopService } from '@/services/barbershop';

export function HomePage() {
  const { data: barbershopsData, isLoading: barbershopsLoading } = useQuery({
    queryKey: ['barbershops', { page: 1 }],
    queryFn: () => barbershopService.getBarbershops({ page: 1 }),
  });

  const { data: barbersData, isLoading: barbersLoading } = useQuery({
    queryKey: ['barbers', { page: 1 }],
    queryFn: () => barbershopService.getBarbers({ page: 1 }),
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a02c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gold-600/15 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6"
              >
                <Sparkles className="h-4 w-4 text-gold-400" />
                <span className="text-sm text-gold-400">Premium Barbershop Experience</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Where Style Meets{' '}
                <span className="gradient-text">Precision</span>
              </h1>
              <p className="text-lg text-dark-300 mb-8 max-w-lg">
                Book appointments with the finest barbers in town. Experience luxury grooming 
                with professional barbers who understand your style.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="glow-gold" asChild>
                  <Link to="/book">
                    Book Appointment
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/barbershops">Explore Barbershops</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '50+', label: 'Expert Barbers' },
                  { value: '10K+', label: 'Happy Clients' },
                  { value: '4.9', label: 'Average Rating' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-gold-400">{stat.value}</div>
                    <div className="text-sm text-dark-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right content - Hero image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main image placeholder */}
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-gold-500/20 to-gold-700/20 border border-gold-500/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scissors className="h-32 w-32 text-gold-500/30" />
                  </div>
                </div>
                
                {/* Floating card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -left-8 top-1/4 p-4 rounded-2xl bg-white dark:bg-dark-800 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark-900 dark:text-white">Booking Confirmed!</p>
                      <p className="text-xs text-dark-500">Today at 2:00 PM</p>
                    </div>
                  </div>
                </motion.div>

                {/* Rating card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -right-8 bottom-1/4 p-4 rounded-2xl bg-white dark:bg-dark-800 shadow-2xl"
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-gold-400 fill-gold-400" />
                    <span className="text-lg font-bold text-dark-900 dark:text-white">4.9</span>
                    <span className="text-sm text-dark-500">(2.5k reviews)</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
              Why Choose <span className="gradient-text">ApeX</span>?
            </h2>
            <p className="text-dark-500 dark:text-dark-400 max-w-2xl mx-auto">
              We provide the best barbershop experience with premium services and professional barbers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Scissors,
                title: 'Expert Barbers',
                description: 'Skilled professionals with years of experience',
              },
              {
                icon: Calendar,
                title: 'Easy Booking',
                description: 'Book appointments online in just a few clicks',
              },
              {
                icon: Clock,
                title: 'Flexible Hours',
                description: 'Open 7 days a week with extended hours',
              },
              {
                icon: Award,
                title: 'Premium Quality',
                description: 'Using only the best products and equipment',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="elevated" hoverable className="h-full">
                  <CardContent className="pt-6 text-center">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 mb-4"
                    >
                      <feature.icon className="h-6 w-6 text-dark-950" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-dark-500 dark:text-dark-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Barbershops */}
      <section className="py-20 bg-dark-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-2">
                Featured Barbershops
              </h2>
              <p className="text-dark-500 dark:text-dark-400">
                Discover the best barbershops near you
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/barbershops">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbershopsLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : barbershopsData?.results?.slice(0, 3).map((barbershop, i) => (
                  <motion.div
                    key={barbershop.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card variant="elevated" hoverable className="overflow-hidden">
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
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                          {barbershop.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-dark-500 dark:text-dark-400 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{barbershop.address}</span>
                        </div>
                        <div className="flex items-center justify-between">
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
                        <Button className="w-full mt-4" asChild>
                          <Link to={`/barbershops/${barbershop.id}`}>View Details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Barbers */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-2">
                Top Rated Barbers
              </h2>
              <p className="text-dark-500 dark:text-dark-400">
                Meet our skilled professionals
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/barbers">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {barbersLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : barbersData?.results?.slice(0, 4).map((barber, i) => (
                  <motion.div
                    key={barber.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card variant="elevated" hoverable className="text-center">
                      <CardContent className="pt-6">
                        <Avatar
                          src={barber.picture}
                          alt={barber.full_name}
                          fallback={barber.full_name}
                          size="xl"
                          className="mx-auto mb-4"
                        />
                        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-1">
                          {barber.full_name}
                        </h3>
                        <p className="text-sm text-dark-500 dark:text-dark-400 mb-2">
                          {barber.experienced_years} years experience
                        </p>
                        <div className="flex items-center justify-center gap-1 mb-4">
                          <Star className="h-4 w-4 text-gold-400 fill-gold-400" />
                          <span className="font-medium text-dark-900 dark:text-white">
                            {barber.average_rating?.toFixed(1) || 'N/A'}
                          </span>
                          <span className="text-sm text-dark-500">
                            ({barber.total_appointments || 0} cuts)
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to={`/barbers/${barber.id}`}>View Profile</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-dark-900 via-dark-950 to-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get a Fresh Cut?
            </h2>
            <p className="text-lg text-dark-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers. Book your appointment now and experience the ApeX difference.
            </p>
            <Button size="lg" className="glow-gold" asChild>
              <Link to="/book">
                Book Your Appointment
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
