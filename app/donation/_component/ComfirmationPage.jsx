import Link from "next/link"
import { FaCheckCircle } from "react-icons/fa"
import { formatCurrency } from "@/utils/donationUtils"


export default function ConfirmationPage({
  amount = 100,
  donor = "",
  transactionId = "",
  date = new Date().toLocaleDateString(),
}) {
  return (
    <div className="max-w-2xl mx-auto p-8 my-10 border rounded-lg bg-white">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-6xl text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Thank You!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your donation has been processed successfully
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Donation Details
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold text-gray-800">
              {formatCurrency(amount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Donor</span>
            <span className="font-semibold text-gray-800">{donor}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-semibold text-gray-800">{transactionId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date</span>
            <span className="font-semibold text-gray-800">{date}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-6">
          A confirmation email has been sent to your email address.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-button text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all"
        >
          Make Another Donation
        </button>
        <Link href='/'>
          <button className="w-full text-white py-2 border rounded-md bg-teal-600 hover:bg-teal-700 mt-4" onClick={() => (window.location.href = "/")}>
            Return to Homepage
          </button>
        </Link>
      </div>
    </div>
  )
}
