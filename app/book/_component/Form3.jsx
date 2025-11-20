"use client"

const Form3 = ({ formData, onChange, errors }) => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Team Booking Information</h3>
          <p className="text-gray-600">
            You are booking our entire ministry team for your event. Our team includes worship leaders, 
            musicians, and ministers who will collaborate to create a powerful and impactful experience.
          </p>
        </div>
      </div>

      <form>
        {/* Event Preferences */}
        <div className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Expected Audience Size</label>
              <input
                type="number"
                name="guestCount"
                placeholder="Enter the number of expected attendees"
                value={formData.guestCount || ''}
                onChange={onChange}
                className="w-full border p-3 rounded-md"
                min="1"
              />
              {errors?.guestCount && (
                <span className="text-red-500 text-sm block mt-2">{errors.guestCount}</span>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mb-6">
          <h2 className="font-medium mb-3">
            Special Request
          </h2>
          <textarea
            name="additionalInfo"
            placeholder="Enter any special request or additional information"
            value={formData.additionalInfo || ''}
            onChange={onChange}
            className="w-full border p-3 rounded-md"
            rows={6}
          />
          {errors?.additionalInfo && (
            <span className="text-red-500 text-sm block mt-2">{errors.additionalInfo}</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form3;
