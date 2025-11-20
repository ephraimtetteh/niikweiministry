"use client"

const Form2 = ({ formData, onChange, errors }) => {
  const handleInputChange = (name, value) => {
    onChange({
      target: {
        name,
        value
      }
    });
  };

  return (
    <div className="w-full">
      <form>
        {/* Personal Information Section */}
        <div className="mb-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName || ''}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="border rounded-md p-2"
              />
              {errors?.fullName && (
                <span className="text-red-500 text-sm">{errors.fullName}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="border rounded-md p-2"
              />
              {errors?.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="border rounded-md p-2"
              />
              {errors?.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form2;
