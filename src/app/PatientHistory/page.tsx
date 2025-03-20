"use client";
import { Client, Databases, ID, Query } from "appwrite";
import { useState, useEffect } from "react";

const PatientDashboard = () => {
  const [entries, setEntries] = useState<any[]>([]); // State to hold patient records
  const [error, setError] = useState<string | null>(null); // Error state

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("67cfcdd3002a87ebea80");

  const databases = new Databases(client);

  const databaseId = "67cff8aa000593955ff2";
  const collectionId = "67cff9040018d7a8f81d";

  // Fetch patient records on component mount
  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        const result = await databases.listDocuments(databaseId, collectionId);
        setEntries(result.documents);
      } catch (error) {
        console.error("Error fetching documents: ", error);
        setError("An error occurred while fetching data. Please try again later.");
      }
    };
    fetchPatientRecords();
  }, []);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-semibold text-center text-gray-800">Patient Dashboard</h1>

      {error && (
        <div className="text-red-500 font-semibold p-2 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Table for displaying patient records */}
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-4xl mx-auto my-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Age</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Gender</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Token</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Time Slot</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry: any, idx: number) => (
              <tr key={idx} className="border-b">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{entry.PatientName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{entry.PatientAge}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{entry.PatientMobile}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{entry.PatientGender}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{entry.Token}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{entry.TimeSlot}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{entry.Date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientDashboard;
