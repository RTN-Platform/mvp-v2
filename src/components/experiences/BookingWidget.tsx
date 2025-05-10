
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";

type BookingWidgetProps = {
  price: string;
  onBookNow: (date: Date | undefined, participants: number) => void;
};

const BookingWidget: React.FC<BookingWidgetProps> = ({ price, onBookNow }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState(1);
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 md:p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Book this experience</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-nature-800">{price}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select date</label>
            <div className="border rounded-md p-1 overflow-x-auto max-w-full">
              <div className="min-w-[280px]">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Participants</label>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setParticipants(p => Math.max(1, p - 1))}
                disabled={participants <= 1}
                className="h-10 w-10"
                aria-label="Decrease participants"
              >
                -
              </Button>
              <span className="mx-4 w-8 text-center">{participants}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setParticipants(p => p + 1)}
                className="h-10 w-10"
                aria-label="Increase participants"
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => onBookNow(date, participants)} 
          className="w-full bg-nature-600 hover:bg-nature-700 text-white"
          disabled={!date}
        >
          {date ? 'Book Now' : 'Select a date'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingWidget;
