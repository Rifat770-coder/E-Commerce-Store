'use client';

export default function Delivery() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">🚚 Delivery Information</h1>
          <p className="text-xl mb-6">Fast, reliable, and secure delivery to your doorstep</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Delivery Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Express Delivery</h3>
            <p className="text-gray-600 mb-4">Get your order within 24 hours</p>
            <div className="text-2xl font-bold text-green-600">$9.99</div>
            <p className="text-sm text-gray-500">Available in major cities</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Standard Delivery</h3>
            <p className="text-gray-600 mb-4">Delivery within 3-5 business days</p>
            <div className="text-2xl font-bold text-blue-600">$4.99</div>
            <p className="text-sm text-gray-500">Nationwide coverage</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🆓</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Free Delivery</h3>
            <p className="text-gray-600 mb-4">On orders above $50</p>
            <div className="text-2xl font-bold text-purple-600">FREE</div>
            <p className="text-sm text-gray-500">5-7 business days</p>
          </div>
        </div>

        {/* Delivery Process */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">How Delivery Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Order Placed</h3>
              <p className="text-sm text-gray-600">Your order is confirmed and being prepared</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏭</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Processing</h3>
              <p className="text-sm text-gray-600">Items are picked and packed with care</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">In Transit</h3>
              <p className="text-sm text-gray-600">Your package is on its way to you</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Delivered</h3>
              <p className="text-sm text-gray-600">Package delivered to your doorstep</p>
            </div>
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🌍 Delivery Coverage</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Major Cities</span>
                <span className="text-green-600 font-semibold">✓ Available</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Suburban Areas</span>
                <span className="text-green-600 font-semibold">✓ Available</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Rural Areas</span>
                <span className="text-blue-600 font-semibold">Limited</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">International</span>
                <span className="text-gray-500">Coming Soon</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Delivery Policies</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Free delivery on orders above $50
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Contactless delivery available
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Real-time tracking for all orders
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Safe and secure packaging
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Flexible delivery time slots
              </li>
            </ul>
          </div>
        </div>

        {/* Track Order */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">📍 Track Your Order</h3>
          <p className="mb-6">Enter your order number to get real-time updates</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter order number"
              className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 border-0"
            />
            <button className="bg-white text-blue-600 px-6 py-2 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors">
              Track
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">❓ Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-2">What are your delivery hours?</h4>
              <p className="text-gray-600 text-sm">We deliver Monday to Saturday, 9 AM to 8 PM. Sunday delivery available for express orders.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-2">Can I change my delivery address?</h4>
              <p className="text-gray-600 text-sm">Yes, you can change your delivery address before the order is dispatched from our warehouse.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-2">What if I&apos;m not home during delivery?</h4>
              <p className="text-gray-600 text-sm">We&apos;ll attempt delivery 3 times. You can also schedule a convenient time or choose a pickup location.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-2">Is my package insured?</h4>
              <p className="text-gray-600 text-sm">Yes, all packages are insured against loss or damage during transit at no extra cost.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}