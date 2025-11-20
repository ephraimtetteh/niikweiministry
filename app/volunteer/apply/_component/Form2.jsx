"use client"

const Form2 = ({ formData, onChange, errors }) => {
  const handleRoleChange = (role) => {
    onChange({
      target: {
        name: 'roles',
        value: {
          ...(formData.roles || {}),
          [role]: !(formData.roles?.[role])
        }
      }
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Volunteer interest</h1>
      <form>
        {/* Roles Section */}
        <div className="mb-6">
          <h2 className="font-medium mb-3">Select Preferred Roles</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="worshipTeam"
                type="checkbox"
                checked={formData.roles?.worshipTeam || false}
                onChange={() => handleRoleChange("worshipTeam")}
                className="mr-3"
              />
              <label htmlFor="worshipTeam">Worship Team</label>
            </div>
            <div className="flex items-center">
              <input
                id="outreachPrograms"
                type="checkbox"
                checked={formData.roles?.outreachPrograms || false}
                onChange={() => handleRoleChange("outreachPrograms")}
                className="mr-3"
              />
              <label htmlFor="outreachPrograms">Outreach Programs</label>
            </div>
            <div className="flex items-center">
              <input
                id="youthMinistry"
                type="checkbox"
                checked={formData.roles?.youthMinistry || false}
                onChange={() => handleRoleChange("youthMinistry")}
                className="mr-3"
              />
              <label htmlFor="youthMinistry">Youth Ministry</label>
            </div>
            <div className="flex items-center">
              <input
                id="eventSupport"
                type="checkbox"
                checked={formData.roles?.eventSupport || false}
                onChange={() => handleRoleChange("eventSupport")}
                className="mr-3"
              />
              <label htmlFor="eventSupport">Event Support</label>
            </div>
            <div className="flex items-center">
              <input
                id="administrativeRoles"
                type="checkbox"
                checked={formData.roles?.administrativeRoles || false}
                onChange={() => handleRoleChange("administrativeRoles")}
                className="mr-3"
              />
              <label htmlFor="administrativeRoles">Administrative Roles</label>
            </div>
          </div>
          {errors?.roles && (
            <span className="text-red-500 text-sm block mt-2">{errors.roles}</span>
          )}
        </div>

        {/* Availability Section */}
        <div className="mb-6">
          <h2 className="font-medium mb-3">Availability</h2>
          <textarea
            name="availability"
            placeholder="Please list the days and times you're available to volunteer"
            value={formData.availability || ''}
            onChange={onChange}
            className="w-full border p-3 rounded-md"
            rows={4}
          />
          {errors?.availability && (
            <span className="text-red-500 text-sm block mt-2">{errors.availability}</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form2;
