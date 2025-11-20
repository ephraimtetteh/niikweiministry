"use client"


const Form3 = ({ formData, onChange, errors }) => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Volunteer interest</h1>
      <form>
        {/* Skills and Motivation Section */}
        <div className="mb-6">
          <h2 className="font-medium mb-3">
            Tell us about your skills and why you want to volunteer
          </h2>
          <textarea
            name="skills"
            placeholder="Share your relevant skills, experience, and motivation for volunteering"
            value={formData.skills || ''}
            onChange={onChange}
            className="w-full border p-3 rounded-md"
            rows={4}
          />
          {errors?.skills && (
            <span className="text-red-500 text-sm block mt-2">{errors.skills}</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form3
