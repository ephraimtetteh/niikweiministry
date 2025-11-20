"use client"

const Form4 = ({ formData, onChange, errors }) => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">References</h1>
      <p className="mb-6 text-gray-600">
        Please provide contact information for a person who can speak to your
        character, skills, and suitability for volunteering. These could be
        employers, teachers, family members, pastors, or community leaders who
        know you well.
      </p>
      <form>
        {/* Full Name */}
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Reference name"
            value={formData.fullName || ''}
            onChange={onChange}
            className="w-full border p-3 rounded-md"
          />
          {errors?.fullName && (
            <span className="text-red-500 text-sm block mt-1">{errors.fullName}</span>
          )}
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Reference phone number"
            value={formData.phoneNumber || ''}
            onChange={onChange}
            className="w-full border p-3 rounded-md"
          />
          {errors?.phoneNumber && (
            <span className="text-red-500 text-sm block mt-1">{errors.phoneNumber}</span>
          )}
        </div>

        {/* Email Address */}
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="email">
            Email Address (optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Reference Email"
            value={formData.email || ''}
            onChange={onChange}
            className="w-full border p-3 rounded-md"
          />
          {errors?.email && (
            <span className="text-red-500 text-sm block mt-1">{errors.email}</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form4;
