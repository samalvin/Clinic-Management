"use client";
import { Client, Databases, ID, Query } from "appwrite";
import { useState, useEffect, useRef } from "react";

const HomePage = () => {
  const [PatientName, setName] = useState("");
  const [PatientAge, setAge] = useState("");
  const [PatientMobile, setPhone] = useState("");
  const [PatientGender, setSex] = useState("");
  const [TimeSlot, setTimeSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to current date
  const [searchedDate, setSearchedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to current date
  const [entries, setEntries] = useState<any[]>([]);
  const [slotArray, setSlotArray] = useState<any[]>([]); // State to store slot data
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null); // Error state
  const [activeSlot, setActiveSlot] = useState<string | null>(null); // To manage active time slots

  const formRef = useRef<HTMLFormElement>(null);

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("clinicmanagement");

  const databases = new Databases(client);

  const databaseId = "67cff8aa000593955ff2";
  const collectionId = "67cff9040018d7a8f81d";

  // Fetch entries on component mount or when the selectedDate is changed
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // Fetch records for the current date or selected date
        const result = await databases.listDocuments(databaseId, collectionId, [
          Query.equal('Date', searchedDate),
        ]);
        const slotResult = await databases.listDocuments(databaseId, '67d2c0b1002692e8118e'); // Assuming this collection contains slot data
        setEntries(result.documents);
        setSlotArray(slotResult.documents); // Populate the slot array
      } catch (error) {
        console.error("Error fetching documents: ", error);
        setError("An error occurred while fetching data. Please try again later.");
      }
    };
    fetchEntries();
  }, [searchedDate]); // Re-fetch when selectedDate changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const age = parseInt(PatientAge, 10);
    if (isNaN(age)) {
      setError("Please enter a valid age.");
      return;
    }

    if (!TimeSlot || !selectedDate) {
      setError("Please select both date and time slot.");
      return;
    }

    try {
      // Fetch entries filtered by TimeSlot and selectedDate using Appwrite's filters
      const result = await databases.listDocuments(databaseId, collectionId, [
        Query.equal('TimeSlot', TimeSlot),
        Query.equal('Date', selectedDate),
      ]);

      const filteredEntries = result.documents;

      // Check if the number of existing entries for this slot is greater than or equal to 5
      if (filteredEntries.length >= 5) {
        setError("This slot is full. Please select another time slot.");
        return;
      }

      const resultBasedOnDate = await databases.listDocuments(databaseId, collectionId, [
        Query.equal('Date', selectedDate),
      ]);

      const filteredEntriesBasedOnDate = resultBasedOnDate.documents;


      // Generate a new token, which will be one more than the current number of patients in the slot
      const token = filteredEntriesBasedOnDate.length + 1;

      // If we're editing an existing entry, update it
      if (editIndex !== null) {
        const updatedEntry = {
          PatientName,
          PatientAge: age,
          PatientMobile,
          PatientGender,
          TimeSlot,
          Date: selectedDate,
          Token: token,
        };

        const documentId = entries[editIndex].$id;
        await databases.updateDocument(databaseId, collectionId, documentId, updatedEntry);
        const updatedEntries = [...entries];
        updatedEntries[editIndex] = { ...updatedEntry, $id: documentId }; ;
        setEntries(updatedEntries);
        setEditIndex(null);
      } else {
        const newEntry = {
          PatientName,
          PatientAge: age,
          PatientMobile,
          PatientGender,
          TimeSlot,
          Date: selectedDate,
          Token: token,
        };

        const createdDocument = await databases.createDocument(databaseId, collectionId, ID.unique(), newEntry);
        setEntries((prevEntries) => [...prevEntries, createdDocument]);
      }

      // Clear the form fields after submission
      setName("");
      setAge("");
      setPhone("");
      setSex("");
      setTimeSlot("");
      setSelectedDate(""); // Clear the date picker as well
      setError(null); // Clear error message after successful submission
    } catch (error) {
      console.error("Error fetching documents: ", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleCancel = async (index: number) => {
    const documentId = entries[index].$id;
    try {
      await databases.deleteDocument(databaseId, collectionId, documentId);
      const updatedEntries = entries.filter((_, i) => i !== index);
      setEntries(updatedEntries);
    //       const updatedEntry = {
    //   ...entries[index],
    //   isCancelled: true,  // Set the isCancelled field to true
    // };

    // await databases.updateDocument(databaseId, collectionId, documentId, updatedEntry);

    // // Update the entries state to reflect the cancellation
    // const updatedEntries = [...entries];
    // updatedEntries[index] = updatedEntry;
    // setEntries(updatedEntries);

    } catch (error) {
      console.error("Error deleting document: ", error);
      setError("An error occurred while deleting the document. Please try again.");
    }
  };

  const handleEdit = (index: number) => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const entryToEdit = entries[index];
    setName(entryToEdit.PatientName);
    setAge(entryToEdit.PatientAge);
    setPhone(entryToEdit.PatientMobile);
    setSex(entryToEdit.PatientGender);
    setTimeSlot(entryToEdit.TimeSlot);
    setSelectedDate(entryToEdit.Date); // Set the date from the entry to edit
    setEditIndex(index);
  };

  const toggleSlot = (slotTime: string) => {
    setActiveSlot(activeSlot === slotTime ? null : slotTime); // Toggle the accordion
  };

  // Group entries by their time slots
  const groupedEntries = entries.reduce((acc: any, entry: any) => {
    if (!acc[entry.TimeSlot]) acc[entry.TimeSlot] = [];
    acc[entry.TimeSlot].push(entry);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-semibold text-center text-gray-800">Patient Information Form</h1>

      {error && (
        <div className="text-red-500 font-semibold p-2 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-xl max-w-2xl mx-auto space-y-6"
        ref={formRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="patientName" className="text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              id="patientName"
              value={PatientName}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-md p-3 mt-2"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="patientAge" className="text-sm font-semibold text-gray-700">Age</label>
            <input
              type="number"
              id="patientAge"
              value={PatientAge}
              onChange={(e) => setAge(e.target.value)}
              className="border border-gray-300 rounded-md p-3 mt-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="patientPhone" className="text-sm font-semibold text-gray-700">Mobile</label>
            <input
              type="text"
              id="patientPhone"
              value={PatientMobile}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-md p-3 mt-2"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="patientGender" className="text-sm font-semibold text-gray-700">Gender</label>
            <select
              id="patientGender"
              value={PatientGender}
              onChange={(e) => setSex(e.target.value)}
              className="border border-gray-300 rounded-md p-3 mt-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col mb-4">
        <label htmlFor="patientDate" className="text-sm font-semibold text-gray-700">Select Date </label>
        <input
          type="date"
          id="patientDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md p-3 mt-2"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
        <div className="flex flex-col">
          <label htmlFor="timeSlot" className="text-sm font-semibold text-gray-700">Select Time Slot</label>
          <select
            id="timeSlot"
            value={TimeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mt-2"
            required
          >
            <option value="">Select Time Slot</option>
            {slotArray.map((slot) => (
              <option key={slot.$id} value={slot.SlotTime}>
                {slot.SlotTime}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 mt-6 rounded-md hover:bg-blue-700"
        >
          {editIndex !== null ? "Update Patient" : "Add Patient"}
        </button>
      </form>

       {/* Date Picker Above Records Section */}
       <div className="flex flex-col mb-4">
        <label htmlFor="patientDate" className="text-sm font-semibold text-gray-700">Select Date to View Records</label>
        <input
          type="date"
          id="patientDate"
          value={searchedDate}
          onChange={(e) => setSearchedDate(e.target.value)}
          className="border border-gray-300 rounded-md p-3 mt-2"
        />
      </div>

      {/* Display Time Slot Accordion */}
      <div className="mt-8">
        {Object.keys(groupedEntries).map((slotTime) => (
          <div key={slotTime} className="border border-gray-300 rounded-md mb-4">
            <button
              onClick={() => toggleSlot(slotTime)}
              className="w-full text-left p-4 font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200"
            >
              {slotTime}
            </button>
            {/* Accordion Content for this slot */}
            {activeSlot === slotTime && (
              <div className="p-4 bg-gray-50 space-y-4">
                {groupedEntries[slotTime].map((entry: any, idx: any) => (
                  <div key={idx} className="bg-white p-4 rounded-md shadow-md my-2">
                    <p><strong>Name:</strong> {entry.PatientName}</p>
                    <p><strong>Age:</strong> {entry.PatientAge}</p>
                    <p><strong>Phone:</strong> {entry.PatientMobile}</p>
                    <p><strong>Gender:</strong> {entry.PatientGender}</p>
                    <p><strong>Token:</strong> {entry.Token}</p>
                    <button
                      onClick={() => handleEdit(idx)}
                      className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancel(idx)}
                      className="text-red-500 hover:text-red-700 font-semibold ml-4"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default HomePage;