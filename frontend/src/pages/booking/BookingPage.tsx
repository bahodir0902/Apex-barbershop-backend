import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Scissors,
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  MapPin,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  Button, 
  Card, 
  CardContent, 
  Avatar, 
  DatePicker,
  TimePicker,
  Skeleton
} from '@/components/ui';
import { barbershopService } from '@/services/barbershop';
import { appointmentService } from '@/services/appointment';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency, generateIdempotencyKey } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Barbershop, Barber, Haircut } from '@/types';

type BookingStep = 'barbershop' | 'barber' | 'service' | 'datetime' | 'confirm';

export function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  // State
  const [currentStep, setCurrentStep] = React.useState<BookingStep>('barbershop');
  const [selectedBarbershop, setSelectedBarbershop] = React.useState<Barbershop | null>(null);
  const [selectedBarber, setSelectedBarber] = React.useState<Barber | null>(null);
  const [selectedHaircut, setSelectedHaircut] = React.useState<Haircut | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>();
  const [customerNotes, setCustomerNotes] = React.useState('');

  // Queries
  const { data: barbershopsData, isLoading: barbershopsLoading } = useQuery({
    queryKey: ['barbershops-booking'],
    queryFn: () => barbershopService.getBarbershops(),
    enabled: currentStep === 'barbershop',
  });

  const { data: barbersData, isLoading: barbersLoading } = useQuery({
    queryKey: ['barbers-booking', selectedBarbershop?.id],
    queryFn: () => barbershopService.getBarbershopBarbers(selectedBarbershop!.id),
    enabled: !!selectedBarbershop && currentStep === 'barber',
  });

  const { data: haircutsData, isLoading: haircutsLoading } = useQuery({
    queryKey: ['haircuts-booking', selectedBarbershop?.id],
    queryFn: () => barbershopService.getBarbershopHaircuts(selectedBarbershop!.id),
    enabled: !!selectedBarbershop && currentStep === 'service',
  });

  const { data: availableDaysData } = useQuery({
    queryKey: ['available-days', selectedBarber?.id],
    queryFn: () => barbershopService.getBarberAvailableDays(selectedBarber!.id),
    enabled: !!selectedBarber && currentStep === 'datetime',
  });

  const { data: availableSlotsData } = useQuery({
    queryKey: ['available-slots', selectedBarber?.id, selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null],
    queryFn: () => barbershopService.getBarberAvailableSlots(
      selectedBarber!.id, 
      format(selectedDate!, 'yyyy-MM-dd')
    ),
    enabled: !!selectedBarber && !!selectedDate && currentStep === 'datetime',
  });

  // Initialize from URL params
  React.useEffect(() => {
    const barbershopId = searchParams.get('barbershop');

    if (barbershopId && barbershopsData?.results) {
      const barbershop = barbershopsData.results.find(b => b.id === barbershopId);
      if (barbershop) {
        setSelectedBarbershop(barbershop);
        setCurrentStep('barber');
      }
    }
  }, [searchParams, barbershopsData]);

  // Mutation
  const createAppointmentMutation = useMutation({
    mutationFn: (data: {
      barbershop_id: string;
      barber_id: string;
      haircut_id: string;
      appointment_date: string;
      appointment_time: string;
      customer_notes?: string;
      idempotency_key: string;
    }) => appointmentService.createAppointment(data),
    onSuccess: () => {
      toast.success('Appointment booked successfully!');
      navigate('/dashboard/appointments');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to book appointment';
      toast.error(message);
    },
  });

  const handleNext = () => {
    const steps: BookingStep[] = ['barbershop', 'barber', 'service', 'datetime', 'confirm'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BookingStep[] = ['barbershop', 'barber', 'service', 'datetime', 'confirm'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleConfirmBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (!selectedBarbershop || !selectedBarber || !selectedHaircut || !selectedDate || !selectedTime) {
      toast.error('Please complete all booking details');
      return;
    }

    createAppointmentMutation.mutate({
      barbershop_id: selectedBarbershop.id,
      barber_id: selectedBarber.id,
      haircut_id: selectedHaircut.id,
      appointment_date: format(selectedDate, 'yyyy-MM-dd'),
      appointment_time: selectedTime,
      customer_notes: customerNotes,
      idempotency_key: generateIdempotencyKey(),
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'barbershop':
        return !!selectedBarbershop;
      case 'barber':
        return !!selectedBarber;
      case 'service':
        return !!selectedHaircut;
      case 'datetime':
        return !!selectedDate && !!selectedTime;
      case 'confirm':
        return true;
      default:
        return false;
    }
  };

  const steps = [
    { id: 'barbershop', label: 'Location' },
    { id: 'barber', label: 'Barber' },
    { id: 'service', label: 'Service' },
    { id: 'datetime', label: 'Date & Time' },
    { id: 'confirm', label: 'Confirm' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">
            Book Your Appointment
          </h1>
          <p className="text-dark-500 dark:text-dark-400">
            Select your preferred barbershop, barber, and time slot
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: currentStepIndex >= index ? 1 : 0.8,
                      backgroundColor: currentStepIndex >= index ? '#d4a02c' : '#e5e7eb',
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                      currentStepIndex >= index 
                        ? 'text-dark-950' 
                        : 'text-dark-500 dark:text-dark-400'
                    }`}
                  >
                    {currentStepIndex > index ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  <span className={`mt-2 text-xs font-medium hidden sm:block ${
                    currentStepIndex >= index 
                      ? 'text-gold-600 dark:text-gold-400' 
                      : 'text-dark-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-colors ${
                    currentStepIndex > index 
                      ? 'bg-gold-500' 
                      : 'bg-dark-200 dark:bg-dark-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Select Barbershop */}
            {currentStep === 'barbershop' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
                  Choose a Barbershop
                </h2>
                {barbershopsLoading ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {barbershopsData?.results?.map((barbershop) => (
                      <motion.div
                        key={barbershop.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          variant={selectedBarbershop?.id === barbershop.id ? 'outlined' : 'elevated'}
                          hoverable
                          className={`cursor-pointer transition-all ${
                            selectedBarbershop?.id === barbershop.id 
                              ? 'ring-2 ring-gold-500 border-gold-500' 
                              : ''
                          }`}
                          onClick={() => setSelectedBarbershop(barbershop)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-200 to-gold-400 dark:from-gold-900 dark:to-gold-700 flex items-center justify-center flex-shrink-0">
                                {barbershop.picture ? (
                                  <img src={barbershop.picture} alt={barbershop.name} className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                  <Scissors className="h-6 w-6 text-gold-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-dark-900 dark:text-white truncate">
                                  {barbershop.name}
                                </h3>
                                <p className="text-sm text-dark-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{barbershop.address}</span>
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-3 w-3 text-gold-400 fill-gold-400" />
                                  <span className="text-xs font-medium text-dark-700 dark:text-dark-200">
                                    {barbershop.average_rating?.toFixed(1) || 'N/A'}
                                  </span>
                                </div>
                              </div>
                              {selectedBarbershop?.id === barbershop.id && (
                                <CheckCircle className="h-6 w-6 text-gold-500" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Barber */}
            {currentStep === 'barber' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
                  Choose a Barber
                </h2>
                {barbersLoading ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                  </div>
                ) : barbersData?.data?.length === 0 ? (
                  <Card variant="outlined">
                    <CardContent className="p-8 text-center text-dark-500">
                      No barbers available at this location.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {barbersData?.data?.map((barber) => (
                      <motion.div
                        key={barber.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          variant={selectedBarber?.id === barber.id ? 'outlined' : 'elevated'}
                          hoverable
                          className={`cursor-pointer transition-all ${
                            selectedBarber?.id === barber.id 
                              ? 'ring-2 ring-gold-500 border-gold-500' 
                              : ''
                          }`}
                          onClick={() => setSelectedBarber(barber)}
                        >
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
                                <p className="text-sm text-dark-500">
                                  {barber.experienced_years} years experience
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-3 w-3 text-gold-400 fill-gold-400" />
                                  <span className="text-xs font-medium text-dark-700 dark:text-dark-200">
                                    {barber.average_rating?.toFixed(1) || 'N/A'}
                                  </span>
                                  <span className="text-xs text-dark-400">
                                    ({barber.total_appointments} cuts)
                                  </span>
                                </div>
                              </div>
                              {selectedBarber?.id === barber.id && (
                                <CheckCircle className="h-6 w-6 text-gold-500" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Select Service */}
            {currentStep === 'service' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
                  Choose a Service
                </h2>
                {haircutsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 rounded-2xl" />
                    ))}
                  </div>
                ) : haircutsData?.data?.length === 0 ? (
                  <Card variant="outlined">
                    <CardContent className="p-8 text-center text-dark-500">
                      No services available at this location.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {haircutsData?.data?.map((haircut) => (
                      <motion.div
                        key={haircut.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card 
                          variant={selectedHaircut?.id === haircut.id ? 'outlined' : 'elevated'}
                          hoverable
                          className={`cursor-pointer transition-all ${
                            selectedHaircut?.id === haircut.id 
                              ? 'ring-2 ring-gold-500 border-gold-500' 
                              : ''
                          }`}
                          onClick={() => setSelectedHaircut(haircut)}
                        >
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
                                  <div className="flex items-center gap-2 text-sm text-dark-500">
                                    <Clock className="h-4 w-4" />
                                    <span>{haircut.duration_minutes} min</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-gold-600 dark:text-gold-400">
                                  {formatCurrency(haircut.price)}
                                </span>
                                {selectedHaircut?.id === haircut.id && (
                                  <CheckCircle className="h-6 w-6 text-gold-500" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Select Date & Time */}
            {currentStep === 'datetime' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
                  Choose Date & Time
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    minDate={new Date()}
                    availableDates={availableDaysData?.data?.available_days?.map(d => d.date)}
                    placeholder="Pick a date"
                  />
                  <TimePicker
                    label="Select Time"
                    value={selectedTime}
                    onChange={setSelectedTime}
                    availableSlots={availableSlotsData?.data?.available_slots || []}
                    placeholder={selectedDate ? "Pick a time" : "Select a date first"}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Any special requests or notes for your barber..."
                    className="w-full rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 px-4 py-3 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Confirm */}
            {currentStep === 'confirm' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
                  Confirm Your Booking
                </h2>
                <Card variant="elevated">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-dark-200 dark:border-dark-700">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gold-500" />
                        <span className="text-dark-500">Location</span>
                      </div>
                      <span className="font-medium text-dark-900 dark:text-white">
                        {selectedBarbershop?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-dark-200 dark:border-dark-700">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gold-500" />
                        <span className="text-dark-500">Barber</span>
                      </div>
                      <span className="font-medium text-dark-900 dark:text-white">
                        {selectedBarber?.full_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-dark-200 dark:border-dark-700">
                      <div className="flex items-center gap-3">
                        <Scissors className="h-5 w-5 text-gold-500" />
                        <span className="text-dark-500">Service</span>
                      </div>
                      <span className="font-medium text-dark-900 dark:text-white">
                        {selectedHaircut?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-dark-200 dark:border-dark-700">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gold-500" />
                        <span className="text-dark-500">Date & Time</span>
                      </div>
                      <span className="font-medium text-dark-900 dark:text-white">
                        {selectedDate && format(selectedDate, 'MMM d, yyyy')} at {selectedTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-lg font-semibold text-dark-900 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-gold-600 dark:text-gold-400">
                        {selectedHaircut && formatCurrency(selectedHaircut.price)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {!isAuthenticated && (
                  <Card variant="outlined" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
                    <CardContent className="p-4">
                      <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                        You need to be logged in to complete your booking.{' '}
                        <a href="/login" className="underline font-medium">Login</a> or{' '}
                        <a href="/register" className="underline font-medium">Sign up</a>
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-200 dark:border-dark-700">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 'barbershop'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {currentStep === 'confirm' ? (
            <Button
              onClick={handleConfirmBooking}
              isLoading={createAppointmentMutation.isPending}
              className="glow-gold"
            >
              Confirm Booking
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
