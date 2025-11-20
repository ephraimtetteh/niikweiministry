import Email from "@/public/volunteer/email.png"
import Calendar from "@/public/volunteer/calendar.png"
import Image from "next/image"
import Orientation from "@/public/volunteer/Orientation.png"

const Confirmation = () => {
  return (
    <div className="w-full py-10 flex flex-col gap-16">
      {/* Application Details Header */}
      <div className="border rounded-md shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Application Details</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Application ID: #VOL-2024-0123</p>
            <p className="text-sm text-gray-600">Submission Date: January 19, 2024</p>
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-semibold relative pb-1">
            Next Step
            <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
        </h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-md shadow-md">
            <div className="p-6 text-center flex justify-center items-center flex-col">
              <Image 
              placeholder="blur"
              src={Email} alt="email" width={50} height={50} className="flex justify-center items-center"/>
              <h3 className="font-semibold mb-3">Check Your Email</h3>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email with important details about your application.
              </p>
            </div>
          </div>

          <div className="border rounded-md shadow-md">
            <div className="p-6 text-center flex justify-center items-center flex-col">
              <Image placeholder="blur" src={Calendar} alt="email" width={50} height={50} className="flex justify-center items-center"/>
              <h3 className="font-semibold mb-3">Await Our Response</h3>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email with important details about your application.
              </p>
            </div>
          </div>

          <div className="border rounded-md shadow-md">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Image placeholder="blur" src={Orientation} alt="email" width={50} height={50} className="flex justify-center items-center"/>
              </div>
              <div className="flex flex-col">
              <h3 className="font-semibold mb-3">Prepare for Orientation</h3>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email with important details about your application.
              </p>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Important Information Section */}
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-semibold relative pb-1">
            Important Information
            <span className="absolute left-0 bottom-0 w-16 h-1 bg-violet-500"></span>
        </h1>
        <div className="space-y-6 border rounded-md shadow-md">
          <div className="">
            <div className="p-6">
              <h3 className="font-semibold mb-4">Application Details</h3>
              <p className="text-sm text-gray-600 mb-4">Please have the following ready for your orientation:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                <li>Government-issued photo ID</li>
                <li>Emergency contact information</li>
                <li>Any relevant certifications</li>
              </ul>
            </div>
          </div>

          <div>
            <div className="p-6">
              <h3 className="font-semibold mb-4">Background Check</h3>
              <p className="text-sm text-gray-600">
                For certain roles, we may require a background check. We'll provide more information about this process
                if applicable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Confirmation