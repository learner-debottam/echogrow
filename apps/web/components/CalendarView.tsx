import Calendar from 'react-calendar';
import { format } from 'date-fns';

type ScheduledPost = {
  id: string;
  date: string;
};

type Props = {
  value: Date;
  onChange: (d: Date) => void;
  posts: ScheduledPost[];
  ariaLabel?: string;
};

export default function CalendarView({ value, onChange, posts, ariaLabel }: Props) {
  return (
    <Calendar
      value={value}
      onChange={(val) => {
        const date = Array.isArray(val) ? val[0] : (val as Date | null);
        if (date) onChange(date);
      }}
      tileContent={({ date }) => {
        const hasPosts = posts.some(p => p.date === format(date, 'yyyy-MM-dd'));
        return hasPosts ? <span className="block text-xs text-blue-600">●</span> : null;
      }}
      aria-label={ariaLabel}
    />
  );
}
