import * as React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar, 
  Clock, 
  MapPin,
  User,
  Scissors,
  XCircle,
  Filter
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  Button, 
  Badge, 
  Skeleton,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui';
import { appointmentService } from '@/services/appointment';
import { formatDate, formatTime, getStatusColor, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Appointment } from '@/types';

export function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [cancelDialog, setCancelDialog] = React.useState<Appointment | null>(null);

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentService.getMyAppointments(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => appointmentService.cancelAppointment(id),
    onSuccess: () => {
      toast.success('Appointment cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
      setCancelDialog(null);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to cancel appointment';
      toast.error(message);
    },
  });

  const appointments = appointmentsData?.data || [];
  const filteredAppointments = statusFilter === 'all' 
    ? appointments 
    : appointments.filter(a => {
        if (statusFilter === 'upcoming') return !a.is_finished && a.is_active;
        if (statusFilter === 'completed') return a.is_finished;
        if (statusFilter === 'cancelled') return !a.is_active;
        return a.status === statusFilter;
      });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
            My Appointments
          </h1>
          <p className="text-dark-500 dark:text-dark-400">
            View and manage your appointments
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Appointments</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 text-dark-300 dark:text-dark-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
                No Appointments Found
              </h3>
              <p className="text-dark-500 dark:text-dark-400 mb-6">
                {statusFilter === 'all' 
                  ? "You haven't booked any appointments yet." 
                  : `No ${statusFilter} appointments.`}
              </p>
              <Button asChild>
                <a href="/book">Book Your First Appointment</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment, i) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left side - Info */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex-shrink-0">
                        <Scissors className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                          {appointment.haircut.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500 dark:text-dark-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(appointment.appointment_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(appointment.appointment_time)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500 dark:text-dark-400">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {appointment.barber.full_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {appointment.barbershop.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Status & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(appointment.status)} size="lg">
                          {appointment.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-lg font-bold text-gold-600 dark:text-gold-400 mt-2">
                          {formatCurrency(appointment.haircut.price)}
                        </p>
                      </div>
                      {!appointment.is_finished && appointment.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCancelDialog(appointment)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {appointment.customer_notes && (
                    <div className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700">
                      <p className="text-sm text-dark-500 dark:text-dark-400">
                        <span className="font-medium">Notes:</span> {appointment.customer_notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cancel Dialog */}
      <Dialog open={!!cancelDialog} onOpenChange={() => setCancelDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {cancelDialog && (
            <div className="py-4">
              <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800 space-y-2">
                <p className="font-semibold text-dark-900 dark:text-white">
                  {cancelDialog.haircut.name}
                </p>
                <p className="text-sm text-dark-500">
                  {formatDate(cancelDialog.appointment_date)} at {formatTime(cancelDialog.appointment_time)}
                </p>
                <p className="text-sm text-dark-500">
                  with {cancelDialog.barber.full_name}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setCancelDialog(null)}>
              Keep Appointment
            </Button>
            <Button 
              variant="danger" 
              onClick={() => cancelDialog && cancelMutation.mutate(cancelDialog.id)}
              isLoading={cancelMutation.isPending}
            >
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
