import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Skeleton } from '@/components/ui';
import { appointmentService } from '@/services/appointment';
import { useAuthStore } from '@/stores/authStore';
import { formatDate, formatTime, getStatusColor, formatCurrency } from '@/lib/utils';

export function DashboardOverview() {
  const { user } = useAuthStore();

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentService.getMyAppointments(),
  });

  const appointments = appointmentsData?.data || [];
  const upcomingAppointments = appointments.filter(a => !a.is_finished && a.is_active);
  const completedAppointments = appointments.filter(a => a.is_finished);
  const cancelledAppointments = appointments.filter(a => !a.is_active);

  const stats = [
    {
      label: 'Upcoming',
      value: upcomingAppointments.length,
      icon: Clock,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      label: 'Completed',
      value: completedAppointments.length,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      label: 'Cancelled',
      value: cancelledAppointments.length,
      icon: XCircle,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    },
    {
      label: 'Total',
      value: appointments.length,
      icon: Calendar,
      color: 'bg-gold-100 text-gold-600 dark:bg-gold-900/30 dark:text-gold-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-dark-500 dark:text-dark-400 mt-1">
          Here's what's happening with your appointments
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark-900 dark:text-white">
                      {isLoading ? '-' : stat.value}
                    </p>
                    <p className="text-sm text-dark-500 dark:text-dark-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/appointments">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-dark-300 dark:text-dark-600 mx-auto mb-3" />
                <p className="text-dark-500 dark:text-dark-400 mb-4">
                  No upcoming appointments
                </p>
                <Button asChild>
                  <Link to="/book">Book Now</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gold-100 dark:bg-gold-900/30">
                        <Calendar className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-dark-900 dark:text-white">
                          {appointment.haircut.name}
                        </p>
                        <p className="text-sm text-dark-500 dark:text-dark-400">
                          {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                        </p>
                        <p className="text-sm text-dark-400">
                          with {appointment.barber.full_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <p className="text-sm font-semibold text-gold-600 dark:text-gold-400 mt-1">
                        {formatCurrency(appointment.haircut.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button className="h-auto py-4" asChild>
                <Link to="/book" className="flex flex-col items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Book Appointment</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4" asChild>
                <Link to="/barbershops" className="flex flex-col items-center gap-2">
                  <ArrowRight className="h-6 w-6" />
                  <span>Browse Barbershops</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
