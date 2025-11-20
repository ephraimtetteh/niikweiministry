"use client"

import { FaRegUser } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";

const BookingConfirmation = ({ bookingData }) => {
  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg border shadow-lg bg-gray-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 border-2 border-purple-500 rounded-full bg-white flex items-center justify-center">
          <svg
            className="w-8 h-8 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-purple-600 mb-2">
          Booking Request Submitted!
        </h2>
        <p className="text-gray-600 mb-4">
          Your booking reference number is {bookingData.bookingId}
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
          
          <div className="space-y-10">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Event Information</h4>
              <div className="flex items-start gap-5">
                  <MdEventAvailable className="text-lg mt-2 lg:text-3xl text-purple-500"/>
                <div className="flex items-start flex-col">
                  <span className="lg:text-xl font-semibold">{bookingData.eventType}</span>
                  <div className="text-sm text-gray-500">
                    {bookingData.eventDate}
                  </div>
                  <div className="text-sm text-gray-500">
                    {bookingData.eventTime}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 flex items-start gap-5">
              <FaRegUser className="text-lg mt-2 lg:text-3xl text-purple-500"/>
              <div>
                <h4 className="font-medium mb-2">Requested Minister</h4>
                <div className="text-gray-600">
                  {bookingData.selectedMinister}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="space-y-1">
                <div className="text-gray-600">{bookingData.fullName}</div>
                <div className="text-gray-500 text-sm">{bookingData.email}</div>
                <div className="text-gray-500 text-sm">{bookingData.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
