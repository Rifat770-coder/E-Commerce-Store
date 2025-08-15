'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Test Page</h1>
        
        <div className="space-y-4">
          <p>This is a test page for the e-commerce application.</p>
          
          <div className="mt-8 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Sample Content</h2>
            <p className="text-gray-700">
              This is some sample content to demonstrate the application layout and styling.
            </p>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold">Card 1</h3>
                <p className="text-sm text-gray-600">Content here</p>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold">Card 2</h3>
                <p className="text-sm text-gray-600">Content here</p>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold">Card 3</h3>
                <p className="text-sm text-gray-600">Content here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 