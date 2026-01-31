import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  isToday,
  isBefore,
  startOfDay
} from 'date-fns';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Button } from './Button';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  availableDates?: string[];
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  error,
  minDate,
  maxDate,
  disabledDates = [],
  availableDates,
  placeholder = 'Select date',
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(value || new Date());

  const days = React.useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  const isDateDisabled = (date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isBefore(maxDate, date)) return true;
    if (disabledDates.some(d => isSameDay(d, date))) return true;
    if (availableDates) {
      const dateStr = format(date, 'yyyy-MM-dd');
      return !availableDates.includes(dateStr);
    }
    return false;
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateDisabled(date)) {
      onChange?.(date);
      setOpen(false);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">
          {label}
        </label>
      )}
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            className={cn(
              'flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-dark-900 transition-all duration-200',
              'dark:bg-dark-800 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent',
              error ? 'border-red-500' : 'border-dark-200 dark:border-dark-700'
            )}
          >
            <span className={cn(!value && 'text-dark-400 dark:text-dark-500')}>
              {value ? format(value, 'MMMM d, yyyy') : placeholder}
            </span>
            <Calendar className="h-5 w-5 text-dark-400" />
          </button>
        </PopoverPrimitive.Trigger>

        <AnimatePresence>
          {open && (
            <PopoverPrimitive.Portal forceMount>
              <PopoverPrimitive.Content
                asChild
                sideOffset={8}
                align="start"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="z-50 w-[320px] rounded-2xl border border-dark-200 bg-white p-4 shadow-xl dark:border-dark-700 dark:bg-dark-800"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-dark-600 dark:text-dark-300" />
                    </button>
                    <h2 className="text-lg font-semibold text-dark-900 dark:text-white">
                      {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-dark-600 dark:text-dark-300" />
                    </button>
                  </div>

                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="h-8 flex items-center justify-center text-xs font-medium text-dark-500 dark:text-dark-400"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                      const disabled = isDateDisabled(day);
                      const selected = value && isSameDay(day, value);
                      const today = isToday(day);
                      const inMonth = isSameMonth(day, currentMonth);

                      return (
                        <motion.button
                          key={i}
                          type="button"
                          disabled={disabled}
                          onClick={() => handleDateSelect(day)}
                          whileHover={!disabled ? { scale: 1.1 } : undefined}
                          whileTap={!disabled ? { scale: 0.95 } : undefined}
                          className={cn(
                            'h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
                            !inMonth && 'opacity-30',
                            disabled && 'opacity-30 cursor-not-allowed',
                            !disabled && !selected && 'hover:bg-gold-100 dark:hover:bg-gold-900/20',
                            selected && 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950',
                            !selected && today && 'border-2 border-gold-500',
                            !selected && !disabled && 'text-dark-700 dark:text-dark-200'
                          )}
                        >
                          {format(day, 'd')}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Today button */}
                  <div className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setCurrentMonth(new Date());
                        handleDateSelect(new Date());
                      }}
                    >
                      Today
                    </Button>
                  </div>
                </motion.div>
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          )}
        </AnimatePresence>
      </PopoverPrimitive.Root>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

// Time Picker Component
interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  label?: string;
  error?: string;
  availableSlots?: string[];
  placeholder?: string;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  label,
  error,
  availableSlots = [],
  placeholder = 'Select time',
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHours = h % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">
          {label}
        </label>
      )}
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            className={cn(
              'flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-dark-900 transition-all duration-200',
              'dark:bg-dark-800 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent',
              error ? 'border-red-500' : 'border-dark-200 dark:border-dark-700'
            )}
          >
            <span className={cn(!value && 'text-dark-400 dark:text-dark-500')}>
              {value ? formatTimeDisplay(value) : placeholder}
            </span>
            <Clock className="h-5 w-5 text-dark-400" />
          </button>
        </PopoverPrimitive.Trigger>

        <AnimatePresence>
          {open && (
            <PopoverPrimitive.Portal forceMount>
              <PopoverPrimitive.Content
                asChild
                sideOffset={8}
                align="start"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="z-50 w-[280px] rounded-2xl border border-dark-200 bg-white p-4 shadow-xl dark:border-dark-700 dark:bg-dark-800"
                >
                  <h3 className="text-sm font-medium text-dark-500 dark:text-dark-400 mb-3">
                    Available Times
                  </h3>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <motion.button
                          key={slot}
                          type="button"
                          onClick={() => {
                            onChange?.(slot);
                            setOpen(false);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            'py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                            value === slot
                              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950'
                              : 'bg-dark-100 text-dark-700 hover:bg-gold-100 dark:bg-dark-700 dark:text-dark-200 dark:hover:bg-gold-900/20'
                          )}
                        >
                          {formatTimeDisplay(slot)}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-dark-500 dark:text-dark-400 py-4">
                      No available time slots
                    </p>
                  )}
                </motion.div>
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          )}
        </AnimatePresence>
      </PopoverPrimitive.Root>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
